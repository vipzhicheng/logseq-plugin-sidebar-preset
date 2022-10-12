import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

const defineSettings: SettingSchemaDesc[] = [
  // @ts-ignore
  {
    key: "generalHeading",
    title: "General settings",
    type: "heading",
  },
  {
    key: "chooseSidebar",
    title: "Choose sidebar",
    description: "Choose sidebar",
    type: "enum",
    enumPicker: "select",
    enumChoices: ["sidebar1", "sidebar2", "sidebar3", "sidebar4", "sidebar5"],
    default: "sidebar1",
  },
  // @ts-ignore
  {
    key: "sidebarlHeading",
    title: "Sidebars",
    type: "heading",
  },
  {
    key: "sidebar1",
    title: "Sidebar 1",
    description: "Sidebar 1",
    type: "string",
    inputAs: "textarea",
    default: "",
  },
  {
    key: "sidebar2",
    title: "Sidebar 2",
    description: "Sidebar 2",
    type: "string",
    inputAs: "textarea",
    default: "",
  },
  {
    key: "sidebar3",
    title: "Sidebar 3",
    description: "Sidebar 3",
    type: "string",
    inputAs: "textarea",
    default: "",
  },
  {
    key: "sidebar4",
    title: "Sidebar 4",
    description: "Sidebar 4",
    type: "string",
    inputAs: "textarea",
    default: "",
  },
  {
    key: "sidebar5",
    title: "Sidebar 5",
    description: "Sidebar 5",
    type: "string",
    inputAs: "textarea",
    default: "",
  },
];
logseq.useSettingsSchema(defineSettings);

const main = async () => {
  const model = {
    async resetSidebar() {
      if (logseq.settings?.chooseSidebar) {
        const sidebar = logseq.settings.chooseSidebar;
        const sidebarContent = logseq.settings[sidebar];
        if (sidebarContent) {
          const sidebarSplit = sidebarContent.split("\n").reverse();

          for (let piece of sidebarSplit) {
            if (piece.startsWith("((")) {
              const uuid = piece.replace(/^\(+/, "").replace(/\)+$/, "");
              const block = await logseq.Editor.getBlock(uuid);
              if (block) {
                logseq.App.openInRightSidebar(block.uuid);
              }
            } else {
              const pageName = piece.replace(/^\[+/, "").replace(/\]+$/, "");
              const page = await logseq.Editor.getPage(pageName);
              if (page) {
                logseq.App.openInRightSidebar(page.uuid);
              }
            }
          }
        }
      }
    },
  };

  logseq.provideModel(model);
  logseq.App.registerUIItem("toolbar", {
    key: "logseq-sidebar-preset",
    template: `
      <a class="button" data-on-click="resetSidebar" title="Reset sidebar">
      <i class="ti ti-layout-sidebar-right" style=""></i>
      </a>
    `,
  });
  logseq.onSettingsChanged(() => {
    model.resetSidebar();
  });
};

logseq.ready(main).catch(console.error);
