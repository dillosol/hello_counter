import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloCounter } from "../target/types/hello_counter";

describe("hello_counter", () => {
  // Set up the provider and program
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.HelloCounter as Program<HelloCounter>;

  it("Initializes and increments a counter", async () => {
    // ✅ Create a brand new keypair for the counter account
    const counter = anchor.web3.Keypair.generate();

    // ✅ Call initializeCounter with that new account
    await program.methods
      .initializeCounter()
      .accounts({
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counter])
      .rpc();

    console.log("✅ Counter initialized:", counter.publicKey.toBase58());

    // ✅ Fetch and log the account data
    let account = await program.account.counter.fetch(counter.publicKey);
    console.log("Initial count:", account.count.toString());

    // ✅ Increment the counter
    await program.methods
      .incrementCounter()
      .accounts({
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
      })
      .rpc();

    // ✅ Fetch again and log new count
    account = await program.account.counter.fetch(counter.publicKey);
    console.log("After increment:", account.count.toString());
  });
});
