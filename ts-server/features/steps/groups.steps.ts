import { When, Then } from '@cucumber/cucumber';
import Context from "./context";

When('a group creation with name {string} is requested', async function (name: string) {
  this.ctx = new Context();
  this.result = await this.ctx.createGroup(name, {
    noValidate: true,
  });
});

Then('group is created correctly', async function () {
  this.ctx.validateGroupCtx(this.result);
});