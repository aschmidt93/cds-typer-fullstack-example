import cds from "@sap/cds";
import { expect } from "chai";
import { describe, it } from "mocha";

import type * as schema from "../@cds-models/de/example";

describe(`schema-foo`, () => {
  cds.test("serve", `${__dirname}/../db/schema-foo.cds`);

  before(async () => {
    const { Foos } = await import("../@cds-models/de/example");

    const foo: schema.Foo = {
      ID: "1",
      bar: "bar",
    };
    await INSERT.into(Foos).entries([foo]);
  });

  it("should select one Foo", async () => {
    const { Foos } = await import("../@cds-models/de/example");
    const foo = await SELECT.one.from(Foos).byKey({ ID: "1" });
    expect(foo?.ID).to.be.eq("1");
  });
});
