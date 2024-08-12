import { When, Then } from '@cucumber/cucumber';
import Context from "./context";

When('a user creation with name {string} and email {string} is requested', async function (name: string, email: string) {
  this.ctx = new Context();
  this.result = await this.ctx.createUser(name, email, {
    recordId: email,
    noValidate: true,
  });
});

Then('user is created correctly', async function () {
  this.ctx.validateUserCtx(this.result);
});