import "@logseq/libs";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import md5 from "md5";

const main = async () => {
  let config = await logseq.App.getUserConfigs();

  const newDefaultSettings: SettingSchemaDesc[] = [
    // @ts-ignore
    {
      key: "sidebarlHeading",
      title: "Sidebars (Auto Load by Graphs)",
      type: "heading",
    },
  ];

  if (config.me.repos.length > 0) {
    config.me.repos.forEach((repo: any) => {
      const readableTitle = repo.url.split("/").slice(-2).join("/");
      newDefaultSettings.push({
        key: `${readableTitle}_${md5(repo.url)}`,
        title: readableTitle,
        description: "",
        type: "string",
        inputAs: "textarea",
        default: "",
      });
    });
  }

  logseq.useSettingsSchema(newDefaultSettings);

  const model = {
    async resetSidebar() {
      if (logseq.settings) {
        await logseq.App.clearRightSidebarBlocks({
          close: false,
        });
        const readableTitle = config.currentGraph
          .split("/")
          .slice(-2)
          .join("/");
        const graphKey = `${readableTitle}_${md5(config.currentGraph)}`;
        const sidebarContent = logseq.settings[graphKey];
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

  logseq.App.onCurrentGraphChanged(async (e) => {
    config = await logseq.App.getUserConfigs();
  });
};

logseq.ready(main).catch(console.error);
