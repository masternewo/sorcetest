"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const config_json_1 = __importDefault(require("../config/config.json"));
const ITemplateItem_1 = require("C:/snapshot/project/obj/models/eft/common/tables/ITemplateItem");
// WTT imports
const WTTInstanceManager_1 = require("./WTTInstanceManager");
// Boss imports
const CustomItemService_1 = require("./CustomItemService");
class PackNStrap {
    instanceManager = new WTTInstanceManager_1.WTTInstanceManager();
    version;
    modName = "WTT-Pack 'n' Strap";
    //#region CustomBosses
    CustomItemService = new CustomItemService_1.CustomItemService();
    debug = false;
    newIdMap = {
        container_smallscavcase: "0c22fc270f59b28c064e1232",
        container_toolpouch: "9543bbe8083934dc3b1b1330",
        container_smalldocscase: "c29f11b2e63a089916739c96",
        container_medpouch: "12403f74773f49be6a2d84b7",
        container_ammopouch: "ae9e418fd5d4c4eec4a0e6ea",
        container_magpouch: "440de5d056825485a0cf3a19",
        container_lunchbox: "6925918065a41e6b1e02a7d7",
        container_keyring: "2eabd4da4ab194eb168e72d3",
        belt_fannypack: "f8bd9b5115b176f3343c15ab",
        aerocorppistoleercombatbelt: "b8c4623858c113c6b723cb00",
        citadelgeneralpurposeutilitybelt: "8a7a8c543eb5f37e45953549",
        pointmanassaultbelt: "adeebd551b9ad402069733ce",
        polytechorionreconbelt: "8226ab90fb7f45d8cfa7fc3d",
        lh63russianfederationdutybelt: "942b6046d454de2606e23725",
        rebel9c: "c473791d93ca36cb24e17ff9",
        rebel9g: "f9a169d09b52ea7b50872357",
        assaullterbelt3: "aa6b05b680b18ae6fe7d8ad9",
        medicbelt: "07e5648876d6b14569c0c1c7",
        mrbgrenadierc: "37e439bcf48f216b37dd40de",
        mrbvogb: "b70d97cc28f80b524ee4ef2f",
        grenadierbelt: "60bb3baf34736c0636250b1a",
        assaultermedic: "e4c26a37cb69e8c50c61202f",
        mrblmga: "0a3e20a6db18234f8d6f218e",
        competitionbelt: "f80bdf274d83869039405ef8",
        riflemanbeltbison: "63ac5146862634e578bcb0c9",
        kitteddangler: "322eb5a82749d49003e82d98"
    };
    preSptLoad(container) {
        this.instanceManager.preSptLoad(container, this.modName);
        this.instanceManager.debug = this.debug;
        if (!config_json_1.default.loseArmbandOnDeath) {
            this.keepItemsInArmbandAfterDeath();
        }
        this.CustomItemService.preSptLoad(this.instanceManager);
    }
    postDBLoad(container) {
        this.instanceManager.postDBLoad(container);
        const itemsDB = this.instanceManager.database.templates?.items;
        if (itemsDB) {
            itemsDB["680fce2ec7b9b222270f074c"] = {
                _id: "680fce2ec7b9b222270f074c",
                _name: "CustomContainerTemplate",
                _parent: "566162e44bdc2d3f298b4573",
                _type: ITemplateItem_1.ItemType.NODE,
                _props: {
                    CustomLayoutName: ""
                }
            };
            itemsDB["680fd1dae5044e670a092e16"] = {
                _id: "680fd1dae5044e670a092e16",
                _name: "CustomContainerItem",
                _parent: "680fce2ec7b9b222270f074c",
                _type: ITemplateItem_1.ItemType.NODE,
                _props: {}
            };
            itemsDB["68154651f849fb4e7d816738"] = {
                _id: "68154651f849fb4e7d816738",
                _name: "CustomSecureContainerItem",
                _parent: "680fce2ec7b9b222270f074c",
                _type: ITemplateItem_1.ItemType.NODE,
                _props: {}
            };
            itemsDB["6815465859b8c6ff13f94026"] = {
                _id: "6815465859b8c6ff13f94026",
                _name: "CustomBeltItem",
                _parent: "680fce2ec7b9b222270f074c",
                _type: ITemplateItem_1.ItemType.NODE,
                _props: {}
            };
        }
        const traderDb = this.instanceManager.database.traders;
        if (traderDb) {
            // Belts to Ragman
            traderDb["5ac3b934156ae10c4430e83c"].base.items_buy.category.push("6815465859b8c6ff13f94026");
            // Cases and Secure Containers to Therapist
            traderDb["54cb57776803fa99248b456e"].base.items_buy.id_list.push("680fd1dae5044e670a092e16");
            traderDb["54cb57776803fa99248b456e"].base.items_buy.id_list.push("68154651f849fb4e7d816738");
        }
        const defaultInventory = itemsDB["55d7217a4bdc2d86028b456d"];
        if (defaultInventory) {
            for (const slot of defaultInventory._props.Slots) {
                // Push custom secure containers to the secure container slot
                if (slot._name === "SecuredContainer") {
                    slot._props.filters[0].Filter.push("68154651f849fb4e7d816738");
                }
                // Push custom belts to the armband slot
                if (slot._name === "ArmBand") {
                    slot._props.filters[0].Filter.push("6815465859b8c6ff13f94026");
                }
            }
        }
        this.CustomItemService.postDBLoad();
        if (this.instanceManager.debug) {
            this.instanceManager.logger.log(`[${this.modName}] Database: Loading complete.`, LogTextColor_1.LogTextColor.GREEN);
        }
        if (config_json_1.default.loseArmbandOnDeath) {
            const dblostondeathConfig = this.instanceManager.configServer.getConfig(ConfigTypes_1.ConfigTypes.LOST_ON_DEATH);
            dblostondeathConfig.equipment.ArmBand = true;
        }
        if (config_json_1.default.addCasesToSecureContainer) {
            for (const caseId of Object.values(this.newIdMap)) {
                for (const item of Object.values(this.instanceManager.database.templates.items)) {
                    if (item._parent === "5448bf274bdc2dfc2f8b456a" || item._parent === "68154651f849fb4e7d816738") {
                        // Log the item being processed
                        //console.log("Checking item: " + item._id);
                        // Check if the item is the bosscontainer
                        if (item._id === "5c0a794586f77461c458f892") {
                            //console.log("Skipping the bosscontainer");
                        }
                        else {
                            const grids = item._props.Grids;
                            if (grids && grids.length > 0) {
                                const filters = grids[0]._props.filters[0];
                                if (filters) {
                                    if (filters.Filter === undefined) {
                                        filters.Filter = [caseId];
                                    }
                                    else {
                                        filters.Filter.push(caseId);
                                    }
                                }
                                else {
                                    this.instanceManager.logger.log(`[${this.modName}] Failed to add cases to securecase filters (THEY DON'T EXIST DUE TO YOUR SVM SETTINGS). Turn off addToSecureCases in PackNStrap or load this BEFORE SVM. `, LogTextColor_1.LogTextColor.YELLOW);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    keepItemsInArmbandAfterDeath() {
        this.instanceManager.container.afterResolution("InRaidHelper", (_, result) => {
            const originalisItemKeptAfterDeath = result.isItemKeptAfterDeath;
            result.isItemKeptAfterDeath = (pmcData, itemToCheck) => {
                // Extract the _id of the item with slotId "ArmBand"
                const armBandItem = pmcData.Inventory.items.find(item => item.slotId === "ArmBand");
                const armBandItemId = armBandItem?._id;
                // Check if itemToCheck has the extracted _id as its parentId
                if (armBandItemId && itemToCheck.parentId === armBandItemId) {
                    return true; // Keep the item after death
                }
                // Otherwise, defer to the original method for other items
                return originalisItemKeptAfterDeath.call(result, pmcData, itemToCheck);
            };
        });
    }
}
module.exports = { mod: new PackNStrap() };
//# sourceMappingURL=mod.js.map