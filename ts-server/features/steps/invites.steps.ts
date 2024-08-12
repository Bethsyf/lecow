import { Given, When, Then } from '@cucumber/cucumber';
import Context, { CreateGroup, CreateUser } from "./context";
import { HTTP_CONFLICT, HTTP_CREATED } from '../../src/lib/httpCodes';

Given('created users:', async function (table) {
  this.ctx = new Context();
  await this.ctx.createUsers(table.hashes() as CreateUser[])
});

Given('created groups:', async function (table) {
  await this.ctx.createGroups(table.hashes() as CreateGroup[])
});

When('user {string} is invited to group {string}', async function (user, group) {
  await this.ctx.invite(user, group);
});

Then(/^the invite was( ?.*) successful$/, async function (ok) {
  this.ctx.wasLastInvite(ok.match(/not/) ? HTTP_CONFLICT : HTTP_CREATED);
});
