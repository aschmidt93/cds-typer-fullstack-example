import cds, { ActionFunctionHandler, ApplicationService, ServiceHandler } from "@sap/cds";

import type * as BooksServiceTypes from "../@cds-models/BooksService";

export default class BooksServiceHandler
  extends ApplicationService
  // we implement the `ServiceHandler` interface to make sure we implement every action/function
  implements ServiceHandler<typeof BooksServiceTypes>
{
  async init() {
    await super.init();

    const BooksService = await import("../@cds-models/BooksService");

    // binding to class methods instead of using anonymous functions
    this.on(BooksService.someFunction, this.onSomeFunction.bind(this));

    this.on(BooksService.someAction, this.onSomeAction.bind(this));
  }

  onSomeFunction: ActionFunctionHandler<typeof BooksServiceTypes.someFunction> = async (req) => {
    const { Books } = await import("../@cds-models/BooksService");
    console.warn(`Called with params id=`, req.data.id, " options=", req.data.options);
    return SELECT.from(Books);
  };

  onSomeAction: ActionFunctionHandler<typeof BooksServiceTypes.someAction> = async (req) => {
    console.warn(`Called with params name=`, req.data.name, " params=", req.data.params);

    // example for calling a service with typesafety
    const service = cds.services.BooksService;
    const response = await service.send("someFunction", {
      id: "",
      options: {
        param1: 0,
        param2: "",
      },
    });
    console.warn(`Received `, response.length, " books");

    return {
      val: "value",
      date: new Date().toISOString(),
    };
  };
}
