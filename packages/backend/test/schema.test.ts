import cds from "@sap/cds";
import { expect } from "chai";
import { describe, it } from "mocha";

import type * as schema from "../@cds-models/de/example";

describe(`schema`, () => {
  cds.test("serve", `${__dirname}/../db/schema.cds`);

  before(async () => {
    const { Authors } = await import("../@cds-models/de/example");

    const author: schema.Author = {
      ID: "0",
      firstName: "foo",
      lastName: "bar",
    };
    await INSERT.into(Authors).entries([author]);
  });

  it("should select one author", async () => {
    const { Authors } = await import("../@cds-models/de/example");
    const author = await SELECT.one.from(Authors).byKey({ ID: "0" });
    expect(author?.ID).to.be.eq("0");
  });
});
