import ApplicationContainer from "./components/Application/ApplicationContainer";
import ApplicationHeader from "./components/Application/ApplicationHeader";
import ApplicationContent from "./components/Application/ApplicationContent";
import ApplicationSidebarNavigation from "./components/Application/ApplicationSidebarNavigation";
import ApplicationSidebarToggler from "./components/Application/ApplicationSidebarToggler";
import ApplicationTitle from "./components/Application/ApplicationTitle";
import ApplicationToolbar from "./components/Application/ApplicationToolbar";
import ApplicationToolbarSection from "./components/Application/ApplicationToolbarSection";
import ApplicationToolbarAction from "./components/Application/ApplicationToolbarAction";
import ApplicationToolbarPanel from "./components/Application/ApplicationToolbarPanel";

import HtmlContentBlock from "./components/Typography/HtmlContentBlock";
import OverflowText from "./components/Typography/OverflowText";
import WhiteSpaceContainer from "./components/Typography/WhiteSpaceContainer";
import Highlighter from "./components/Typography/Highlighter";

import Grid from "./components/Grid/Grid";
import GridRow from "./components/Grid/GridRow";
import GridColumn from "./components/Grid/GridColumn";

import WorkspaceContent from "./components/Workspace/WorkspaceContent";
import WorkspaceMain from "./components/Workspace/WorkspaceMain";
import WorkspaceSide from "./components/Workspace/WorkspaceSide";
import WorkspaceHeader from "./components/Workspace/WorkspaceHeader";

import Icon from "./components/Icon/Icon";
import IconButton from "./components/Icon/IconButton";

import Label from "./components/Label/Label";
import Button from "./components/Button/Button";
import Checkbox from "./components/Checkbox/Checkbox";
import RadioButton from "./components/RadioButton/RadioButton";
import Tabs from "./components/Tabs/Tabs";
import Tab from "./components/Tabs/Tab";
import TabTitle from "./components/Tabs/TabTitle";
import TextField from "./components/TextField/TextField";
import TextArea from "./components/TextField/TextArea";
import SearchField from "./components/TextField/SearchField";
import Switch from "./components/Switch/Switch";
import NumericInput from "./components/NumericInput/NumericInput";
import FieldItem from "./components/Form/FieldItem";
import FieldItemRow from "./components/Form/FieldItemRow";
import FieldSet from "./components/Form/FieldSet";
import { AutoCompleteField } from "./components/AutocompleteField/AutoCompleteField";

import Menu from "./components/Menu/Menu";
import MenuItem from "./components/Menu/MenuItem";
import MenuDivider from "./components/Menu/MenuDivider";

import ContextOverlay from "./components/ContextOverlay/ContextOverlay";
import ContextMenu from "./components/ContextOverlay/ContextMenu";

import Pagination from "./components/Pagination/Pagination";

import Tag from "./components/Tag/Tag";
import TagList from "./components/Tag/TagList";

import Notification from "./components/Notification/Notification";
import Toast from "./components/Notification/Toast";
import { Select } from "@blueprintjs/select";

import { Iframe } from "./components/Iframe/Iframe";
import { IframeModal } from "./components/Iframe/IframeModal";

import {
    OverviewItem,
    OverviewItemActions,
    OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    OverviewItemList,
} from "./components/OverviewItem";

import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
} from "./components/SimpleTable";

import BreadcrumbList from "./components/Breadcrumb/BreadcrumbList";
import BreadcrumbItem from "./components/Breadcrumb/BreadcrumbItem";

import Modal from "./components/Dialog/Modal";
import SimpleDialog from "./components/Dialog/SimpleDialog";
import AlertDialog from "./components/Dialog/AlertDialog";

import {
    Card,
    CardHeader,
    CardTitle,
    CardOptions,
    CardContent,
    CardActions,
    CardActionsAux,
} from "./components/Card";

import Spacing from "./components/Separation/Spacing";
import Divider from "./components/Separation/Divider";

import Tooltip from "./components/Tooltip/Tooltip";

import Toolbar from "./components/Toolbar/Toolbar";
import ToolbarSection from "./components/Toolbar/ToolbarSection";

import Section from "./components/Structure/Section";
import SectionHeader from "./components/Structure/SectionHeader";
import TitlePage from "./components/Structure/TitlePage";
import TitleMainsection from "./components/Structure/TitleMainsection";
import TitleSubsection from "./components/Structure/TitleSubsection";

import Accordion from "./components/Accordion/Accordion";
import AccordionItem from "./components/Accordion/AccordionItem";

import Link from "./components/Link/Link";

import Spinner from "./components/Spinner/Spinner";

import { PropertyName, PropertyValue, PropertyValuePair, PropertyValueList } from "./components/PropertyValuePair";

import * as TypographyClassNames from "./components/Typography/classnames";
import {ClassNames as IntentClassNames} from "./common/Intent";
import { openInNewTab } from "./common/utils/openInNewTab";
import { ProgressBar } from "./components/ProgressBar/ProgressBar";
import List from "./components/List/List";

const HelperClasses = {
    Typography: TypographyClassNames,
    Intent: IntentClassNames,
};

const Utilities = {
     openInNewTab
}

import * as LegacyReplacements from "./legacy-replacements";

export {
    ApplicationContainer,
    ApplicationHeader,
    ApplicationContent,
    ApplicationSidebarNavigation,
    ApplicationSidebarToggler,
    ApplicationTitle,
    ApplicationToolbar,
    ApplicationToolbarSection,
    ApplicationToolbarAction,
    ApplicationToolbarPanel,
    HtmlContentBlock,
    OverflowText,
    WhiteSpaceContainer,
    Highlighter,
    Grid,
    GridRow,
    GridColumn,
    List,
    WorkspaceContent,
    WorkspaceMain,
    WorkspaceSide,
    WorkspaceHeader,
    Menu,
    MenuItem,
    MenuDivider,
    ContextOverlay,
    ContextMenu,
    OverviewItem,
    OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    OverviewItemActions,
    OverviewItemList,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
    Icon,
    IconButton,
    Label,
    Button,
    Checkbox,
    RadioButton,
    Tabs,
    Tab,
    TabTitle,
    TextField,
    TextArea,
    SearchField,
    Switch, // TODO: scss styles
    NumericInput, // TODO: scss styles
    FieldItem,
    FieldItemRow,
    FieldSet,
    BreadcrumbList,
    BreadcrumbItem,
    Modal,
    SimpleDialog,
    AlertDialog,
    Card,
    CardHeader,
    CardTitle,
    CardOptions,
    CardContent,
    CardActions,
    CardActionsAux,
    Spacing,
    Divider,
    Tooltip,
    Section,
    SectionHeader,
    TitlePage,
    TitleMainsection,
    TitleSubsection,
    Accordion,
    AccordionItem,
    Toolbar,
    ToolbarSection,
    Tag,
    TagList,
    Pagination,
    Notification,
    Link,
    Spinner,
    PropertyName,
    PropertyValue,
    PropertyValuePair,
    PropertyValueList,
    Toast,
    HelperClasses,
    Select, // TODO: include as own element
    AutoCompleteField,
    ProgressBar,
    Iframe,
    IframeModal,
    Utilities,
    LegacyReplacements,
};

export * from "./cmem";
export * from "./extensions/react-flow";
