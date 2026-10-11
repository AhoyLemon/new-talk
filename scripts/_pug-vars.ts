// Writes setup's answers into the `- const name = "…"` lines of pug/partials/_variables.pug. Each value lands inside a double-quoted Pug string, so quotes and backslashes are escaped, and it goes in through a replacer function so `$` patterns in it ($&, $', $$) stay literal.
export const pugString = (value: string) => value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

export function setPugConst(source: string, name: string, value: string): string {
  return source.replace(new RegExp(`- const ${name} = ".*"`), () => `- const ${name} = "${pugString(value)}"`);
}
