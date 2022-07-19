import * as icons from "@carbon/icons-react"

/** Valid icon names. */
export type ValidIconName = "application-dataintegration"
    | "application-homepage"
    | "application-useraccount"
    | "application-warning"
    | "application-mapping"
    | "application-explore"
    | "application-vocabularies"
    | "application-queries"
    | "application-legacygui"
    | "application-activities"
    | "module-timetracker"
    | "module-accesscontrol"
    | "module-annotation"
    | "module-dashboard"
    | "module-search"
    | "module-visualization"
    | "module-reports"
    | "module-thesauri"
    | "module-linkedrules"
    | "module-integrations"
    | "module-gdprsearch"
    | "toggler-showmore"
    | "toggler-showless"
    | "toggler-moveright"
    | "toggler-moveleft"
    | "toggler-maximize"
    | "toggler-minimize"
    | "toggler-tree"
    | "navigation-back"
    | "navigation-forth"
    | "navigation-close"
    | "navigation-jump"
    | "navigation-last"
    | "navigation-previous"
    | "navigation-next"
    | "navigation-first"
    | "item-moremenu"
    | "item-vertmenu"
    | "item-viewdetails"
    | "item-clone"
    | "item-edit"
    | "item-evaluation"
    | "item-execution"
    | "item-info"
    | "item-remove"
    | "item-add-artefact"
    | "item-launch"
    | "item-download"
    | "item-question"
    | "item-copy"
    | "item-save"
    | "item-start"
    | "item-stop"
    | "item-reload"
    | "item-shuffle"
    | "item-draggable"
    | "operation-search"
    | "operation-clear"
    | "operation-undo"
    | "operation-redo"
    | "operation-logout"
    | "operation-filter"
    | "operation-filteredit"
    | "operation-comparison"
    | "operation-transform"
    | "operation-aggregation"
    | "operation-commit"
    | "operation-sharelink"
    | "data-sourcepath"
    | "data-targetpath"
    | "list-sort"
    | "list-sortasc"
    | "list-sortdesc"
    | "state-info"
    | "state-success"
    | "state-warning"
    | "state-danger"
    | "state-unchecked"
    | "state-checked"
    | "state-partlychecked"
    | "artefact-project"
    | "artefact-workflow"
    | "artefact-dataset"
    | "artefact-dataset-csv"
    | "artefact-dataset-multicsv"
    | "artefact-dataset-sparkview"
    | "artefact-dataset-sqlendpoint"
    | "artefact-dataset-jdbc"
    | "artefact-dataset-xml"
    | "artefact-dataset-json"
    | "artefact-dataset-excel"
    | "artefact-dataset-file"
    | "artefact-dataset-eccencadataplatform"
    | "artefact-dataset-sparqlendpoint"
    | "artefact-dataset-neo4j"
    | "artefact-transform"
    | "artefact-linking"
    | "artefact-task"
    | "artefact-customtask"
    | "artefact-file"
    | "artefact-embedded"
    | "artefact-remote"
    | "artefact-deprecated"
    | "artefact-uncategorized"
    | "artefact-rawdata"
    | "artefact-report"
    | "activity-error-report"
    | "select-caret"
    | "linked-item"
    | "operation-auto-graph-layout"
    | "unlinked-item"
    | "write-protected"
    | "settings"
    | "undefined"
    | "Undefined";

export interface IconSized {
    small: (props: any) => JSX.Element | null
    normal: (props: any) => JSX.Element | null
    large: (props: any) => JSX.Element | null
}
const canonicalIconNames: Record<ValidIconName, IconSized> = {
    "application-dataintegration": {
        small: icons.DataUnstructured16,
        normal: icons.DataUnstructured20,
        large: icons.DataUnstructured32
    },
    "application-homepage": {
        small: icons.Workspace16,
        normal: icons.Workspace20,
        large: icons.Workspace32
    },
    "application-useraccount": {
        small: icons.UserAvatar16,
        normal: icons.UserAvatar20,
        large: icons.UserAvatar32
    },
    "application-warning": {
        small: icons.WarningAlt16,
        normal: icons.WarningAlt20,
        large: icons.WarningAlt32
    },
    "application-mapping": {
        small: icons.ModelBuilder16,
        normal: icons.ModelBuilder20,
        large: icons.ModelBuilder32
    },
    "application-explore": {
        small: icons.Explore16,
        normal: icons.Explore20,
        large: icons.Explore32
    },
    "application-vocabularies": {
        small: icons.Catalog16,
        normal: icons.Catalog20,
        large: icons.Catalog32
    },
    "application-queries": {
        small: icons.DataView16,
        normal: icons.DataView20,
        large: icons.DataView32
    },
    "application-legacygui": {
        small: icons.ResetAlt16,
        normal: icons.ResetAlt20,
        large: icons.ResetAlt32
    },
    "application-activities": {
        small: icons.Activity16,
        normal: icons.Activity20,
        large: icons.Activity32
    },
    "module-timetracker": {
        small: icons.Timer16,
        normal: icons.Timer20,
        large: icons.Timer32
    },
    "module-accesscontrol": {
        small: icons.UserAdmin16,
        normal: icons.UserAdmin20,
        large: icons.UserAdmin32
    },
    "module-annotation": {
        small: icons.WatsonHealthTextAnnotationToggle16,
        normal: icons.WatsonHealthTextAnnotationToggle20,
        large: icons.WatsonHealthTextAnnotationToggle32
    },
    "module-dashboard": {
        small: icons.Dashboard16,
        normal: icons.Dashboard20,
        large: icons.Dashboard32
    },
    "module-search": {
        small: icons.Search16,
        normal: icons.Search20,
        large: icons.Search32
    },
    "module-visualization": {
        small: icons.DataVis_116,
        normal: icons.DataVis_120,
        large: icons.DataVis_132
    },
    "module-reports": {
        small: icons.ReportData16,
        normal: icons.ReportData20,
        large: icons.ReportData32
    },
    "module-thesauri": {
        small: icons.Book16,
        normal: icons.Book20,
        large: icons.Book32
    },
    "module-linkedrules": {
        small: icons.Connect16,
        normal: icons.Connect20,
        large: icons.Connect32
    },
    "module-integrations": {
        small: icons.AppConnectivity16,
        normal: icons.AppConnectivity20,
        large: icons.AppConnectivity32
    },
    "module-gdprsearch": {
        small: icons.UserProfile16,
        normal: icons.UserProfile20,
        large: icons.UserProfile32
    },
    "toggler-showmore": {
        small: icons.ChevronDown16,
        normal: icons.ChevronDown20,
        large: icons.ChevronDown32
    },
    "toggler-showless": {
        small: icons.ChevronUp16,
        normal: icons.ChevronUp20,
        large: icons.ChevronUp32
    },
    "toggler-moveright": {
        small: icons.ChevronRight16,
        normal: icons.ChevronRight20,
        large: icons.ChevronRight32
    },
    "toggler-moveleft": {
        small: icons.ChevronLeft16,
        normal: icons.ChevronLeft20,
        large: icons.ChevronLeft32
    },
    "toggler-maximize": {
        small: icons.Maximize16,
        normal: icons.Maximize20,
        large: icons.Maximize32
    },
    "toggler-minimize": {
        small: icons.Minimize16,
        normal: icons.Minimize20,
        large: icons.Minimize32
    },
    "toggler-tree": {
        small: icons.TreeViewAlt16,
        normal: icons.TreeViewAlt20,
        large: icons.TreeViewAlt32
    },

    "navigation-back": {
        small: icons.ArrowLeft16,
        normal: icons.ArrowLeft20,
        large: icons.ArrowLeft32
    },
    "navigation-forth": {
        small: icons.ArrowRight16,
        normal: icons.ArrowRight20,
        large: icons.ArrowRight32
    },
    "navigation-close": {
        small: icons.Close16,
        normal: icons.Close20,
        large: icons.Close32
    },
    "navigation-jump": {
        small: icons.JumpLink16,
        normal: icons.JumpLink20,
        large: icons.JumpLink32
    },
    "navigation-last": {
        small: icons.PageLast16,
        normal: icons.PageLast20,
        large: icons.PageLast32
    },
    "navigation-previous": {
        small: icons.ChevronLeft16,
        normal: icons.ChevronLeft20,
        large: icons.ChevronLeft32
    },
    "navigation-next": {
        small: icons.ChevronRight16,
        normal: icons.ChevronRight20,
        large: icons.ChevronRight32
    },
    "navigation-first": {
        small: icons.PageFirst16,
        normal: icons.PageFirst20,
        large: icons.PageFirst32
    },

    "item-moremenu": {
        small: icons.OverflowMenuVertical16,
        normal: icons.OverflowMenuVertical20,
        large: icons.OverflowMenuVertical32
    },
    "item-vertmenu": {
        small: icons.OverflowMenuHorizontal16,
        normal: icons.OverflowMenuHorizontal20,
        large: icons.OverflowMenuHorizontal32
    },
    "item-viewdetails": {
        small: icons.View16,
        normal: icons.View20,
        large: icons.View32
    },
    "item-clone": {
        small: icons.Copy16,
        normal: icons.Copy20,
        large: icons.Copy32
    },
    "item-edit": {
        small: icons.Edit16,
        normal: icons.Edit20,
        large: icons.Edit32
    },
    "item-evaluation": {
        small: icons.Analytics16,
        normal: icons.Analytics20,
        large: icons.Analytics32
    },
    "item-execution": {
        small: icons.Run16,
        normal: icons.Run20,
        large: icons.Run32
    },
    "item-info": {
        small: icons.Information16,
        normal: icons.Information20,
        large: icons.Information32
    },
    "item-remove": {
        small: icons.TrashCan16,
        normal: icons.TrashCan20,
        large: icons.TrashCan32
    },
    "item-add-artefact": {
        small: icons.AddAlt16,
        normal: icons.AddAlt20,
        large: icons.AddAlt32
    },
    "item-launch": {
        small: icons.Launch16,
        normal: icons.Launch20,
        large: icons.Launch32
    },
    "item-download": {
        small: icons.Download16,
        normal: icons.Download20,
        large: icons.Download32
    },
    "item-question": {
        small: icons.Help16,
        normal: icons.Help20,
        large: icons.Help32
    },
    "item-copy": {
        small: icons.CopyFile16,
        normal: icons.CopyFile20,
        large: icons.CopyFile32
    },
    "item-save": {
        small: icons.Save16,
        normal: icons.Save20,
        large: icons.Save32
    },
    "item-start": {
        small: icons.PlayFilledAlt16,
        normal: icons.PlayFilledAlt20,
        large: icons.PlayFilledAlt32
    },
    "item-stop": {
        small: icons.StopFilledAlt16,
        normal: icons.StopFilledAlt20,
        large: icons.StopFilledAlt32
    },
    "item-reload": {
        small: icons.Renew16,
        normal: icons.Renew20,
        large: icons.Renew32
    },
    "item-shuffle": {
        small: icons.Shuffle16,
        normal: icons.Shuffle20,
        large: icons.Shuffle32
    },
    "item-draggable": {
        small: icons.Draggable16,
        normal: icons.Draggable20,
        large: icons.Draggable32
    },

    "operation-search": {
        small: icons.Search16,
        normal: icons.Search20,
        large: icons.Search32
    },
    "operation-clear": {
        small: icons.Close16,
        normal: icons.Close20,
        large: icons.Close32
    },
    "operation-undo": {
        small: icons.Undo16,
        normal: icons.Undo20,
        large: icons.Undo32
    },
    "operation-redo": {
        small: icons.Redo16,
        normal: icons.Redo20,
        large: icons.Redo32
    },
    "operation-logout": {
        small: icons.Logout16,
        normal: icons.Logout20,
        large: icons.Logout32
    },
    "operation-filter": {
        small: icons.Filter16,
        normal: icons.Filter20,
        large: icons.Filter32
    },
    "operation-filteredit": {
        small: icons.FilterEdit16,
        normal: icons.FilterEdit20,
        large: icons.FilterEdit32
    },
    "operation-transform": {
        small: icons.Calculation16,
        normal: icons.Calculation20,
        large: icons.Calculation32
    },
    "operation-comparison": {
        small: icons.Compare16,
        normal: icons.Compare20,
        large: icons.Compare32
    },
    "operation-aggregation": {
        small: icons.DataCollection16,
        normal: icons.DataCollection20,
        large: icons.DataCollection32
    },
    "operation-commit": {
        small: icons.Commit16,
        normal: icons.Commit20,
        large: icons.Commit32
    },
    "operation-sharelink": {
        small: icons.CopyLink16,
        normal: icons.CopyLink20,
        large: icons.CopyLink32
    },

    "data-sourcepath": {
        small: icons.Data_216,
        normal: icons.Data_220,
        large: icons.Data_232
    },
    "data-targetpath": {
        small: icons.Data_116,
        normal: icons.Data_120,
        large: icons.Data_132
    },

    "list-sort": {
        small: icons.ArrowsVertical16,
        normal: icons.ArrowsVertical20,
        large: icons.ArrowsVertical32
    },
    "list-sortasc": {
        small: icons.ArrowDown16,
        normal: icons.ArrowDown20,
        large: icons.ArrowDown32
    },
    "list-sortdesc": {
        small: icons.ArrowUp16,
        normal: icons.ArrowUp20,
        large: icons.ArrowUp32
    },

    "state-info": {
        small: icons.InformationFilled16,
        normal: icons.InformationFilled20,
        large: icons.InformationFilled32
    },
    "state-success": {
        small: icons.CheckmarkFilled16,
        normal: icons.CheckmarkFilled20,
        large: icons.CheckmarkFilled32
    },
    "state-warning": {
        small: icons.WarningAltFilled16,
        normal: icons.WarningAltFilled20,
        large: icons.WarningAltFilled32
    },
    "state-danger": {
        small: icons.ErrorFilled16,
        normal: icons.ErrorFilled20,
        large: icons.ErrorFilled32
    },
    "state-unchecked": {
        small: icons.Checkbox16,
        normal: icons.Checkbox20,
        large: icons.Checkbox32
    },
    "state-checked": {
        small: icons.CheckboxChecked16,
        normal: icons.CheckboxChecked20,
        large: icons.CheckboxChecked32
    },
    "state-partlychecked": {
        small: icons.CheckboxIndeterminate16,
        normal: icons.CheckboxIndeterminate20,
        large: icons.CheckboxIndeterminate32
    },

    "artefact-project": {
        small: icons.Folder16,
        normal: icons.Folder20,
        large: icons.Folder32
    },
    "artefact-workflow": {
        small: icons.ModelBuilder16,
        normal: icons.ModelBuilder20,
        large: icons.ModelBuilder32
    },
    "artefact-dataset": {
        small: icons.Data_216,
        normal: icons.Data_220,
        large: icons.Data_232
    },
    "artefact-dataset-csv": {
        small: icons.Csv16,
        normal: icons.Csv20,
        large: icons.Csv32
    },
    "artefact-dataset-multicsv": {
        small: icons.Csv16,
        normal: icons.Csv20,
        large: icons.Csv32
    },
    "artefact-dataset-sparkview": {
        small: icons.Sql16,
        normal: icons.Sql20,
        large: icons.Sql32
    },
    "artefact-dataset-sqlendpoint": {
        small: icons.Sql16,
        normal: icons.Sql20,
        large: icons.Sql32
    },
    "artefact-dataset-jdbc": {
        small: icons.Sql16,
        normal: icons.Sql20,
        large: icons.Sql32
    },
    "artefact-dataset-xml": {
        small: icons.Xml16,
        normal: icons.Xml20,
        large: icons.Xml32
    },
    "artefact-dataset-json": {
        small: icons.Json16,
        normal: icons.Json20,
        large: icons.Json32
    },
    "artefact-dataset-excel": {
        small: icons.Xls16,
        normal: icons.Xls20,
        large: icons.Xls32
    },
    "artefact-dataset-file": {
        small: icons.DataVis_116,
        normal: icons.DataVis_120,
        large: icons.DataVis_132
    },
    "artefact-dataset-eccencadataplatform": {
        small: icons.DataVis_116,
        normal: icons.DataVis_120,
        large: icons.DataVis_132
    },
    "artefact-dataset-sparqlendpoint": {
        small: icons.DataVis_116,
        normal: icons.DataVis_120,
        large: icons.DataVis_132
    },
    "artefact-dataset-neo4j": {
        small: icons.DataVis_116,
        normal: icons.DataVis_120,
        large: icons.DataVis_132
    },
    "artefact-transform": {
        small: icons.DataRefinery16,
        normal: icons.DataRefinery20,
        large: icons.DataRefinery32
    },
    "artefact-linking": {
        small: icons.Connect16,
        normal: icons.Connect20,
        large: icons.Connect32
    },
    "artefact-task": {
        small: icons.Script16,
        normal: icons.Script20,
        large: icons.Script32
    },
    "artefact-customtask": {
        small: icons.Script16,
        normal: icons.Script20,
        large: icons.Script32
    },
    "artefact-file": {
        small: icons.Document16,
        normal: icons.Document20,
        large: icons.Document32
    },
    "artefact-embedded": {
        small: icons.DataBase16,
        normal: icons.DataBase20,
        large: icons.DataBase32
    },
    "artefact-remote": {
        small: icons.VirtualMachine16,
        normal: icons.VirtualMachine20,
        large: icons.VirtualMachine32
    },
    "artefact-deprecated": {
        small: icons.WarningSquare16,
        normal: icons.WarningSquare20,
        large: icons.WarningSquare32
    },
    "artefact-uncategorized": {
        small: icons.Unknown16,
        normal: icons.Unknown20,
        large: icons.Unknown32
    },
    "artefact-rawdata": {
        small: icons.ScriptReference16,
        normal: icons.ScriptReference20,
        large: icons.ScriptReference32
    },
    "artefact-report": {
        small: icons.Report16,
        normal: icons.Report20,
        large: icons.Report32
    },

    "activity-error-report": {
        small: icons.Error16,
        normal: icons.Error20,
        large: icons.Error32
    },

    "select-caret": {
        small: icons.CaretSort16,
        normal: icons.CaretSort20,
        large: icons.CaretSort32
    },

    "linked-item": {
        small: icons.Link16,
        normal: icons.Link20,
        large: icons.Link32
    },
    "unlinked-item": {
        small: icons.Unlink16,
        normal: icons.Unlink20,
        large: icons.Unlink32
    },

    "operation-auto-graph-layout": {
        small: icons.ChartNetwork16,
        normal: icons.ChartNetwork20,
        large: icons.ChartNetwork32
    },

    "write-protected": {
        small: icons.DocumentProtected16,
        normal: icons.DocumentProtected20,
        large: icons.DocumentProtected32
    },

    "settings": {
        small: icons.Settings16,
        normal: icons.Settings20,
        large: icons.Settings32
    },

    "undefined": {
        small: icons.Undefined16,
        normal: icons.Undefined20,
        large: icons.Undefined32
    },
    "Undefined": {
        small: icons.Undefined16,
        normal: icons.Undefined20,
        large: icons.Undefined32
    },
}

export default canonicalIconNames
