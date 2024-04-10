import cds from "@sap/cds";

export async function cds_server(o: unknown) {
  const defaultServer = (await cds.server(o)) as unknown;
  return defaultServer;
}
