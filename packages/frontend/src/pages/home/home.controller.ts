import MessageToast from "sap/m/MessageToast";
import Controller from "sap/ui/core/mvc/Controller";

import { Request } from "../../common/request";

/**
 * @namespace example.frontend.pages.home
 */
export default class Home extends Controller {
  private async onSomeFunction() {
    const service = Request.service("BooksService");
    const response = await service.function("someFunction", {
      id: "123",
      options: {
        param1: 0,
        param2: "asd",
      },
    });

    MessageToast.show(`Called function 'someFunction' and got ${response.data.value.length} books`);
  }

  private async onSomeAction() {
    const service = Request.service("BooksService");
    const response = await service.action("someAction", {
      name: "someName",
      params: {
        param1: 0,
        param2: "asd",
      },
    });

    MessageToast.show(
      `Called action 'someAction' and got response ${JSON.stringify(response.data)}`
    );
  }
}
