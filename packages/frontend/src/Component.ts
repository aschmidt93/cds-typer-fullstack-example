import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Device from "sap/ui/Device";
import IconPool from "sap/ui/core/IconPool";
import UIComponent from "sap/ui/core/UIComponent";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

import { createDeviceModel } from "./common/model/device.model";

/**
 * @namespace example.frontend
 */
export default class Component extends UIComponent {
  public static metadata = {
    manifest: "json",
  };

  private contentDensityClass: string;

  public init(): void {
    // call the base component's init function
    super.init();

    // enable routing
    this.getRouter().initialize();

    // set the device model
    this.setModel(createDeviceModel(), "device");

    // Registriere Material Icons (https://fonts.google.com/icons + https://github.com/google/material-design-icons/tree/master/font)
    IconPool.registerFont({
      collectionName: "material-outlined",
      fontFamily: "MaterialIconsOutlined-Regular",
      fontURI: "/resources/fonts/",
      lazy: false,
    });

    // set browser window title after i18n files have been loaded
    const i18nModel = this.getModel("i18n") as ResourceModel;
    const resouBundle = i18nModel.getResourceBundle() as ResourceBundle;
    document.title = resouBundle.getText("appTitle");
  }

  /**
   * Aus SAPUI5 Template https://github.com/SAP-samples/ui5-cap-event-app/blob/typescript/packages/ui-form/src/Component.ts
   * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
   * design mode class should be set, which influences the size appearance of some controls.
   *
   * @public
   * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
   */
  public getContentDensityClass(): string {
    if (this.contentDensityClass === undefined) {
      // check whether FLP has already set the content density class; do nothing in this case
      if (
        document.body.classList.contains("sapUiSizeCozy") ||
        document.body.classList.contains("sapUiSizeCompact")
      ) {
        this.contentDensityClass = "";
      } else if (!Device.support.touch) {
        // apply "compact" mode if touch is not supported
        this.contentDensityClass = "sapUiSizeCompact";
      } else {
        // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
        this.contentDensityClass = "sapUiSizeCozy";
      }
    }
    return this.contentDensityClass;
  }
}
