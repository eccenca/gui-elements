import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Color from "color";

import CssCustomProperties from "./../../../common/utils/CssCustomProperties";
import {
    Button,
    CLASSPREFIX as eccgui,
    FieldItem,
    FieldItemRow,
    Section,
    SectionHeader,
    Spacing,
    Tabs,
    TextArea,
    TextField,
    TitleSubsection,
} from "./../../../index";

interface ColorPaletteConfiguratorProps {
    customColorProperties?: string;
}

const ColorPaletteConfigurator = ({ customColorProperties }: ColorPaletteConfiguratorProps) => {
    const palettePrefix = `--${eccgui}-color-palette-`;

    const createPaletteData = (csscustomprops: string | undefined) => {
        const colors = (
            csscustomprops
                ? csscustomprops.split(";").map((rule: string) => {
                      return rule.split(":").map((rulepart: string) => {
                          return rulepart.trim();
                      });
                  })
                : new CssCustomProperties({
                      selectorText: `:root`,
                      filterName: (name: string) => {
                          return name.includes(palettePrefix);
                      },
                      removeDashPrefix: false,
                      returnObject: false,
                  }).customProperties()
        )
            .filter((colorconfig: object) => {
                if (!Array.isArray(colorconfig)) {
                    return false;
                }
                if (colorconfig.length !== 2) {
                    return false;
                }
                return true;
            })
            .map((colorconfig: object) => {
                return [colorconfig[0].replace(palettePrefix, ""), Color(colorconfig[1]).rgb()];
            });

        const data = new Object();

        for (const [key, value] of colors) {
            const hierarchy = key.split("-");
            if (!data[hierarchy[0]]) {
                data[hierarchy[0]] = new Object();
            }
            if (!data[hierarchy[0]][hierarchy[1]]) {
                data[hierarchy[0]][hierarchy[1]] = new Object();
            }
            if (!data[hierarchy[0]][hierarchy[1]][hierarchy[2]]) {
                data[hierarchy[0]][hierarchy[1]][hierarchy[2]] = value;
            }
        }

        return data;
    };

    const createCustomPropsSerialization = (data: object) => {
        let serialization = "";
        for (const [group, tints] of Object.entries(data)) {
            for (const [tint, weights] of Object.entries(tints as object)) {
                for (const [weight, value] of Object.entries(weights)) {
                    serialization =
                        serialization +
                        `--${eccgui}-color-palette-${group}-${tint}-${weight}: ${(value as Color).hex()};\n`;
                }
            }
        }
        return serialization.trim();
    };

    const createSassSerialization = (data: object) => {
        const createTintData = (tint: string, weights: object) => {
            return `\t\t"${tint}": eccgui-create-color-tints(${Object.values(weights)
                .map((color) => color.hex())
                .join(" ")}),\n`;
        };

        const createGroupData = (group: string, tints: object) => {
            let groupData = `\t"${group}": (\n`;
            for (const [tint, weights] of Object.entries(tints)) {
                groupData = groupData + createTintData(tint, weights);
            }
            return groupData + `\t),\n`;
        };

        let sassData = `$eccgui-color-palette-light: (\n`;

        for (const [group, tints] of Object.entries(data)) {
            sassData = sassData + createGroupData(group, tints);
        }

        return sassData + `) !default;`;
    };

    const [paletteData, setPaletteData] = React.useState<object | undefined>(undefined);
    const [userPaletteProps, setUserPaletteProps] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        const paletteData = createPaletteData(customColorProperties);
        //console.log("paletteData", paletteData);
        setPaletteData(paletteData);
    }, [customColorProperties]);

    const editorPanel = (
        <div>
            {paletteData &&
                Object.keys(paletteData).map((group, id) => {
                    return (
                        <Section key={id}>
                            <SectionHeader>
                                <TitleSubsection>{group}</TitleSubsection>
                            </SectionHeader>
                            <Spacing size="small" />
                            {Object.keys(paletteData[group]).map((tint, id) => {
                                return (
                                    <FieldItemRow justifyItemWidths key={id}>
                                        {Object.keys(paletteData[group][tint]).map((weight, id) => {
                                            return (
                                                <FieldItem
                                                    key={id}
                                                    labelProps={{ text: `${tint}${weight}` }}
                                                    messageText={paletteData[group][tint][weight].hex()}
                                                >
                                                    <TextField
                                                        type="color"
                                                        defaultValue={paletteData[group][tint][weight].hex()}
                                                        onValueChange={(newcolor) => {
                                                            paletteData[group][tint][weight] = Color(newcolor).rgb();
                                                            // console.log("new palette", paletteData);
                                                            setPaletteData({ ...paletteData });
                                                        }}
                                                    />
                                                </FieldItem>
                                            );
                                        })}
                                    </FieldItemRow>
                                );
                            })}
                            <Spacing size="large" hasDivider />
                        </Section>
                    );
                })}
        </div>
    );

    return (
        <Tabs
            id="colorconfig"
            onChange={() => {}}
            tabs={[
                {
                    id: "editor",
                    panel: editorPanel,
                    title: "Editor",
                },
                {
                    id: "css",
                    panel: (
                        <div>
                            <TextArea
                                defaultValue={paletteData && createCustomPropsSerialization(paletteData)}
                                onChange={(event) => {
                                    setUserPaletteProps(event.target.value);
                                }}
                            />
                            <Button
                                text="Load to editor"
                                onClick={() => setPaletteData(createPaletteData(userPaletteProps))}
                            />
                        </div>
                    ),
                    title: "CSS properties",
                },
                {
                    id: "scss",
                    panel: (
                        <div>
                            <pre>
                                <code>{paletteData && createSassSerialization(paletteData)}</code>
                            </pre>
                        </div>
                    ),
                    title: "SCSS configuration",
                },
            ]}
        />
    );
};

export default {
    title: "Components/Application/Colors",
    component: ColorPaletteConfigurator,
    argTypes: {},
} as Meta<typeof ColorPaletteConfigurator>;

const Template: StoryFn<typeof ColorPaletteConfigurator> = (args) => <ColorPaletteConfigurator {...args} />;

export const Default = Template.bind({});

Default.args = {
    customColorProperties: "",
};
