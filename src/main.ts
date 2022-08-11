import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

const defineSettings: SettingSchemaDesc[] = [
  {
    key: "sidebar_content",
    title: "Sidebar Content",
    description: "Sidebar Content",
    default: "",
    type: "string",
    inputAs: "range",
  },
];

logseq.useSettingsSchema(defineSettings);

const main = async () => {
  logseq.App.showMsg("Hello World!");
};

logseq.ready(main).catch(console.error);
