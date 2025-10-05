use anchor_lang::prelude::*;

declare_id!("8AmJmcmKmZUESRixk7T9nyBT4crkZo2nQUNigmM69CL8");

#[program]
pub mod hello_counter {
    use super::*;

    pub fn initialize_counter(ctx: Context<InitializeCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.user = ctx.accounts.user.key();
        msg!("Counter initialized to 0");
        Ok(())
    }

    pub fn increment_counter(ctx: Context<IncrementCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        msg!("Counter incremented Current value: {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCounter<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32)]
    pub counter: Account<'info, Counter>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct IncrementCounter<'info> {
    #[account(mut, has_one = user)]
    pub counter: Account<'info, Counter>,

    pub user: Signer<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub user: Pubkey,
}
