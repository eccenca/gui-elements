import * as icons from "@carbon/icons-react";
import { IconProps as CarbonIconProps } from "carbon-components-react";

/** Valid icon names. */
export type ValidIconName =
    | "application-activities"
    | "application-dataintegration"
    | "application-explore"
    | "application-homepage"
    | "application-legacygui"
    | "application-mapping"
    | "application-queries"
    | "application-useraccount"
    | "application-vocabularies"
    | "application-warning"
    | "artefact-commit"
    | "artefact-customtask"
    | "artefact-dataset"
    | "artefact-dataset-csv"
    | "artefact-dataset-eccencadataplatform"
    | "artefact-dataset-excel"
    | "artefact-dataset-file"
    | "artefact-dataset-jdbc"
    | "artefact-dataset-json"
    | "artefact-dataset-multicsv"
    | "artefact-dataset-neo4j"
    | "artefact-dataset-sparkview"
    | "artefact-dataset-sparqlendpoint"
    | "artefact-dataset-sqlendpoint"
    | "artefact-dataset-xml"
    | "artefact-deprecated"
    | "artefact-embedded"
    | "artefact-errorlog"
    | "artefact-file"
    | "artefact-linking"
    | "artefact-project"
    | "artefact-rawdata"
    | "artefact-remote"
    | "artefact-report"
    | "artefact-task"
    | "artefact-transform"
    | "artefact-uncategorized"
    | "artefact-workflow"
    | "data-sourcepath"
    | "data-targetpath"
    | "item-add-artefact"
    | "item-clone"
    | "item-comment"
    | "item-copy"
    | "item-download"
    | "item-draggable"
    | "item-edit"
    | "item-evaluation"
    | "item-execution"
    | "item-info"
    | "item-launch"
    | "item-moremenu"
    | "item-question"
    | "item-reload"
    | "item-remove"
    | "item-reset"
    | "item-save"
    | "item-settings"
    | "item-shuffle"
    | "item-skip-forward"
    | "item-start"
    | "item-stop"
    | "item-upload"
    | "item-vertmenu"
    | "item-viewdetails"
    | "list-sort"
    | "list-sortasc"
    | "list-sortdesc"
    | "module-accesscontrol"
    | "module-annotation"
    | "module-dashboard"
    | "module-gdprsearch"
    | "module-integrations"
    | "module-linkedrules"
    | "module-reports"
    | "module-search"
    | "module-thesauri"
    | "module-timetracker"
    | "module-visualization"
    | "navigation-back"
    | "navigation-close"
    | "navigation-first"
    | "navigation-forth"
    | "navigation-jump"
    | "navigation-last"
    | "navigation-next"
    | "navigation-previous"
    | "operation-aggregation"
    | "operation-autolayout"
    | "operation-clear"
    | "operation-commit"
    | "operation-comparison"
    | "operation-filter"
    | "operation-filteredit"
    | "operation-link"
    | "operation-logout"
    | "operation-redo"
    | "operation-search"
    | "operation-sharelink"
    | "operation-transform"
    | "operation-undo"
    | "operation-unlink"
    | "state-checked"
    | "state-checkedsimple"
    | "state-confirmed"
    | "state-danger"
    | "state-declined"
    | "state-info"
    | "state-partlychecked"
    | "state-protected"
    | "state-success"
    | "state-unchecked"
    | "state-warning"
    | "toggler-caret"
    | "toggler-caretright"
    | "toggler-caretdown"
    | "toggler-maximize"
    | "toggler-minimize"
    | "toggler-moveleft"
    | "toggler-moveright"
    | "toggler-rowexpand"
    | "toggler-rowcollapse"
    | "toggler-showless"
    | "toggler-showmore"
    | "toggler-star-empty"
    | "toggler-star-filled"
    | "toggler-tree"
    | "form-template"
    | "undefined";

export type CarbonIconType = React.ComponentType<CarbonIconProps>;

/**
 * @deprecated
 * use CarbonIconType instead
 */
export type IconSized = CarbonIconType;

const canonicalIconNames: Record<ValidIconName, CarbonIconType> = {
    "application-activities": icons.Activity,
    "application-dataintegration": icons.DataUnstructured,
    "application-explore": icons.Explore,
    "application-homepage": icons.Workspace,
    "application-legacygui": icons.ResetAlt,
    "application-mapping": icons.ModelBuilder,
    "application-queries": icons.DataView,
    "application-useraccount": icons.UserAvatar,
    "application-vocabularies": icons.Catalog,
    "application-warning": icons.WarningAlt,

    "artefact-commit": icons.Commit,
    "artefact-customtask": icons.Script,
    "artefact-dataset-csv": icons.Csv,
    "artefact-dataset-eccencadataplatform": icons.DataVis_1,
    "artefact-dataset-excel": icons.Xls,
    "artefact-dataset-file": icons.DataVis_1,
    "artefact-dataset": icons.Data_2,
    "artefact-dataset-jdbc": icons.Sql,
    "artefact-dataset-json": icons.Json,
    "artefact-dataset-multicsv": icons.Csv,
    "artefact-dataset-neo4j": icons.DataVis_1,
    "artefact-dataset-sparkview": icons.Sql,
    "artefact-dataset-sparqlendpoint": icons.DataVis_1,
    "artefact-dataset-sqlendpoint": icons.Sql,
    "artefact-dataset-xml": icons.Xml,
    "artefact-deprecated": icons.WarningSquare,
    "artefact-embedded": icons.DataBase,
    "artefact-errorlog": icons.WarningOther, // FIXME: we may check for a better icon
    "artefact-file": icons.Document,
    "artefact-linking": icons.Connect,
    "artefact-project": icons.Folder,
    "artefact-rawdata": icons.ScriptReference,
    "artefact-remote": icons.VirtualMachine,
    "artefact-report": icons.Report,
    "artefact-task": icons.Script,
    "artefact-transform": icons.DataRefinery,
    "artefact-uncategorized": icons.Unknown,
    "artefact-workflow": icons.ModelBuilder,

    "data-sourcepath": icons.Data_2,
    "data-targetpath": icons.Data_1,

    "item-add-artefact": icons.AddAlt,
    "item-clone": icons.Copy,
    "item-comment": icons.AddComment,
    "item-copy": icons.CopyFile,
    "item-download": icons.Download,
    "item-draggable": icons.Draggable,
    "item-edit": icons.Edit,
    "item-evaluation": icons.Analytics,
    "item-execution": icons.Run,
    "item-info": icons.Information,
    "item-launch": icons.Launch,
    "item-moremenu": icons.OverflowMenuVertical,
    "item-question": icons.Help,
    "item-reload": icons.Renew,
    "item-remove": icons.TrashCan,
    "item-reset": icons.Reset,
    "item-save": icons.Save,
    "item-settings": icons.Settings,
    "item-shuffle": icons.Shuffle,
    "item-skip-forward": icons.SkipForwardFilled,
    "item-start": icons.PlayFilledAlt,
    "item-stop": icons.StopFilledAlt,
    "item-upload": icons.Upload,
    "item-vertmenu": icons.OverflowMenuHorizontal,
    "item-viewdetails": icons.View,

    "list-sortasc": icons.ArrowDown,
    "list-sortdesc": icons.ArrowUp,
    "list-sort": icons.ArrowsVertical,

    "module-accesscontrol": icons.UserAdmin,
    "module-annotation": icons.WatsonHealthTextAnnotationToggle,
    "module-dashboard": icons.Dashboard,
    "module-gdprsearch": icons.UserProfile,
    "module-integrations": icons.AppConnectivity,
    "module-linkedrules": icons.Connect,
    "module-reports": icons.ReportData,
    "module-search": icons.Search,
    "module-thesauri": icons.Book,
    "module-timetracker": icons.Timer,
    "module-visualization": icons.DataVis_1,

    "navigation-back": icons.ArrowLeft,
    "navigation-close": icons.Close,
    "navigation-first": icons.PageFirst,
    "navigation-forth": icons.ArrowRight,
    "navigation-jump": icons.JumpLink,
    "navigation-last": icons.PageLast,
    "navigation-next": icons.ChevronRight,
    "navigation-previous": icons.ChevronLeft,

    "operation-aggregation": icons.DataCollection,
    "operation-autolayout": icons.ChartNetwork,
    "operation-clear": icons.Close,
    "operation-commit": icons.Commit,
    "operation-comparison": icons.Compare,
    "operation-filteredit": icons.FilterEdit,
    "operation-filter": icons.Filter,
    "operation-link": icons.Link,
    "operation-logout": icons.Logout,
    "operation-redo": icons.Redo,
    "operation-search": icons.Search,
    "operation-sharelink": icons.CopyLink,
    "operation-transform": icons.Calculation,
    "operation-undo": icons.Undo,
    "operation-unlink": icons.Unlink,

    "state-checked": icons.CheckboxChecked,
    "state-checkedsimple": icons.Checkmark,
    "state-confirmed": icons.ThumbsUp,
    "state-danger": icons.ErrorFilled,
    "state-declined": icons.ThumbsDown,
    "state-info": icons.InformationFilled,
    "state-partlychecked": icons.CheckboxIndeterminate,
    "state-protected": icons.DocumentProtected,
    "state-success": icons.CheckmarkFilled,
    "state-unchecked": icons.Checkbox,
    "state-warning": icons.WarningAltFilled,

    "toggler-caret": icons.CaretSort,
    "toggler-caretright": icons.CaretRight,
    "toggler-caretdown": icons.CaretDown,
    "toggler-maximize": icons.Maximize,
    "toggler-minimize": icons.Minimize,
    "toggler-moveleft": icons.ChevronLeft,
    "toggler-moveright": icons.ChevronRight,
    "toggler-rowexpand": icons.RowExpand,
    "toggler-rowcollapse": icons.RowCollapse,
    "toggler-showless": icons.ChevronUp,
    "toggler-showmore": icons.ChevronDown,
    "toggler-star-empty": icons.Star,
    "toggler-star-filled": icons.StarFilled,
    "toggler-tree": icons.TreeViewAlt,

    "form-template": icons.Parameter,

    undefined: icons.Undefined,
};

export default canonicalIconNames;
