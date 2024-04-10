import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";

/**
 * @namespace <%= projectName %>.frontend.model.device
 */
export function createDeviceModel(): JSONModel {
  const oModel = new JSONModel(Device);
  oModel.setDefaultBindingMode("OneWay");
  return oModel;
}
