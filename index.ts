import ApplicationContainer from "./src/components/Application/ApplicationContainer";
import ApplicationHeader from "./src/components/Application/ApplicationHeader";
import ApplicationContent from "./src/components/Application/ApplicationContent";
import ApplicationSidebarNavigation from "./src/components/Application/ApplicationSidebarNavigation";
import ApplicationSidebarToggler from "./src/components/Application/ApplicationSidebarToggler";
import ApplicationTitle from "./src/components/Application/ApplicationTitle";
import ApplicationToolbar from "./src/components/Application/ApplicationToolbar";
import ApplicationToolbarSection from "./src/components/Application/ApplicationToolbarSection";
import ApplicationToolbarAction from "./src/components/Application/ApplicationToolbarAction";
import ApplicationToolbarPanel from "./src/components/Application/ApplicationToolbarPanel";

import HtmlContentBlock from "./src/components/Typography/HtmlContentBlock";
import OverflowText from "./src/components/Typography/OverflowText";
import WhiteSpaceContainer from "./src/components/Typography/WhiteSpaceContainer";
import Highlighter from "./src/components/Typography/Highlighter";

import Grid from "./src/components/Grid/Grid";
import GridRow from "./src/components/Grid/GridRow";
import GridColumn from "./src/components/Grid/GridColumn";

import WorkspaceContent from "./src/components/Workspace/WorkspaceContent";
import WorkspaceMain from "./src/components/Workspace/WorkspaceMain";
import WorkspaceSide from "./src/components/Workspace/WorkspaceSide";
import WorkspaceHeader from "./src/components/Workspace/WorkspaceHeader";

import Icon from "./src/components/Icon/Icon";
import IconButton from "./src/components/Icon/IconButton";

import Label from "./src/components/Label/Label";
import Button from "./src/components/Button/Button";
import Checkbox from "./src/components/Checkbox/Checkbox";
import RadioButton from "./src/components/RadioButton/RadioButton";
import Tabs from "./src/components/Tabs/Tabs";
import TextField from "./src/components/TextField/TextField";
import TextArea from "./src/components/TextField/TextArea";
import SearchField from "./src/components/TextField/SearchField";
import Switch from "./src/components/Switch/Switch";
import NumericInput from "./src/components/NumericInput/NumericInput";
import FieldItem from "./src/components/Form/FieldItem";
import FieldItemRow from "./src/components/Form/FieldItemRow";
import FieldSet from "./src/components/Form/FieldSet";
import { AutoCompleteField } from "./src/components/AutocompleteField/AutoCompleteField";

import Menu from "./src/components/Menu/Menu";
import MenuItem from "./src/components/Menu/MenuItem";
import MenuDivider from "./src/components/Menu/MenuDivider";

import ContextOverlay from "./src/components/ContextOverlay/ContextOverlay";
import ContextMenu from "./src/components/ContextOverlay/ContextMenu";

import Pagination from "./src/components/Pagination/Pagination";

import Tag from "./src/components/Tag/Tag";
import TagList from "./src/components/Tag/TagList";

import Notification from "./src/components/Notification/Notification";
import Toast from "./src/components/Notification/Toast";
import { Select } from "@blueprintjs/select";

import { Iframe } from "./src/components/Iframe/Iframe";
import { IframeModal } from "./src/components/Iframe/IframeModal";

import {
    OverviewItem,
    OverviewItemActions,
    OverviewItemDepiction,
    OverviewItemDescription,
    OverviewItemLine,
    OverviewItemList,
} from "./src/components/OverviewItem";

import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableHeader,
} from "./src/components/SimpleTable";

import BreadcrumbList from "./src/components/Breadcrumb/BreadcrumbList";
import BreadcrumbItem from "./src/components/Breadcrumb/BreadcrumbItem";

import Modal from "./src/components/Dialog/Modal";
import SimpleDialog from "./src/components/Dialog/SimpleDialog";
import AlertDialog from "./src/components/Dialog/AlertDialog";

import {
    Card,
    CardHeader,
    CardTitle,
    CardOptions,
    CardContent,
    CardActions,
    CardActionsAux,
} from "./src/components/Card";

import Spacing from "./src/components/Separation/Spacing";
import Divider from "./src/components/Separation/Divider";

import Tooltip from "./src/components/Tooltip/Tooltip";

import Toolbar from "./src/components/Toolbar/Toolbar";
import ToolbarSection from "./src/components/Toolbar/ToolbarSection";

import Section from "./src/components/Structure/Section";
import SectionHeader from "./src/components/Structure/SectionHeader";
import TitlePage from "./src/components/Structure/TitlePage";
import TitleMainsection from "./src/components/Structure/TitleMainsection";
import TitleSubsection from "./src/components/Structure/TitleSubsection";

import Accordion from "./src/components/Accordion/Accordion";
import AccordionItem from "./src/components/Accordion/AccordionItem";

import Link from "./src/components/Link/Link";

import Spinner from "./src/components/Spinner/Spinner";

import { PropertyName, PropertyValue, PropertyValuePair, PropertyValueList } from "./src/components/PropertyValuePair";

import MultiSelect from "./src/components/MultiSelect/MultiSelect";

import * as TypographyClassNames from "./src/components/Typography/classnames";
import { ClassNames as IntentClassNames } from "./src/common/Intent";
import { openInNewTab } from "./src/common/utils/openInNewTab";
import { ProgressBar } from "./src/components/ProgressBar/ProgressBar";

const HelperClasses = {
    Typography: TypographyClassNames,
    Intent: IntentClassNames,
};

const Utilities = {
    openInNewTab,
};

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
    MultiSelect,
    Utilities,
};
