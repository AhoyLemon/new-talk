import { test } from "node:test";
import assert from "node:assert/strict";

import { setPugConst } from "./_pug-vars";

const variables = `- const talkTitle = "[LEMON TALK TEMPLATE]"\n- const subtitle = ""\n`;

test("a plain value replaces the line's string", () => {
  assert.equal(setPugConst(variables, "talkTitle", "Cheat at CSS"), `- const talkTitle = "Cheat at CSS"\n- const subtitle = ""\n`);
});

test("quotes and backslashes are escaped for the Pug string", () => {
  assert.equal(setPugConst(variables, "subtitle", `say "hi" \\ bye`), `- const talkTitle = "[LEMON TALK TEMPLATE]"\n- const subtitle = "say \\"hi\\" \\\\ bye"\n`);
});

test("dollar signs survive as written", () => {
  for (const title of ["Make $$ with CSS", "Cash $& prizes", "Don't $' break", "A $` tick"]) {
    assert.equal(setPugConst(variables, "talkTitle", title).split("\n")[0], `- const talkTitle = "${title}"`);
  }
});
