import { hash } from "@node-rs/argon2";
import { db, pool } from "./index";
import { usersTable } from "./schema/users";

type SeedAccount = {
  username: string | undefined;
  password: string | undefined;
  flow: "direct" | "guided";
  profile: "ben" | "james" | null;
};

const accounts: SeedAccount[] = [
  {
    username: process.env.NORTHSTAR_DEMO_USERNAME,
    password: process.env.NORTHSTAR_DEMO_PASSWORD,
    flow: "direct",
    profile: "ben",
  },
  {
    username: process.env.NORTHSTAR_GUIDED_USERNAME,
    password: process.env.NORTHSTAR_GUIDED_PASSWORD,
    flow: "guided",
    profile: null,
  },
];

async function main() {
  const toSeed = accounts.filter(
    (account): account is SeedAccount & { username: string; password: string } =>
      Boolean(account.username && account.password),
  );

  if (toSeed.length === 0) {
    throw new Error(
      "Set NORTHSTAR_DEMO_USERNAME/PASSWORD and/or NORTHSTAR_GUIDED_USERNAME/PASSWORD before seeding.",
    );
  }

  for (const account of toSeed) {
    const passwordHash = await hash(account.password);
    await db
      .insert(usersTable)
      .values({
        username: account.username,
        passwordHash,
        flow: account.flow,
        profile: account.profile,
      })
      .onConflictDoUpdate({
        target: usersTable.username,
        set: { passwordHash, flow: account.flow, profile: account.profile },
      });
    console.log(`Seeded user "${account.username}" (${account.flow}).`);
  }

  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
