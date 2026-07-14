
import { cn } from "@/common/utils/cn";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

import OverviewItemActions, { OverviewItemActionsProps } from "@/components/molecules/OverviewItem/OverviewItemActions";

export type CardOptionsProps = Omit<OverviewItemActionsProps, "hiddenInteractions">;

/**
 * Container for elements that allow user-interaction, e.g. buttons or context menus.
 * Can contain multiple of them.
 * Is displayed right-aligned in the `CardHeader`.
 */
export const CardOptions = ({ children, className = "", ...otherProps }: CardOptionsProps) => {
    return (
        <OverviewItemActions
            {...otherProps}
            className={cn(
                `${eccgui}-card__options`,
                // 1.5 card-spacing units (21px / 1.5rem) reserved for the header's own left padding;
                // `!` (Tailwind v4 trailing-important syntax) is needed on `shrink` because
                // `OverviewItemActions` now applies its own unconditional `flex-none` (shrink: 0) base
                // class, which would otherwise tie with this same-specificity override
                "shrink! max-w-[calc(100%_-_1.5rem)]",
                className,
            )}
        >
            {children}
        </OverviewItemActions>
    );
};

export default CardOptions;
