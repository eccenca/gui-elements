import { cn } from "@/common/utils/cn";
import OverviewItemLine, { OverviewItemLineProps } from "@/components/molecules/OverviewItem/OverviewItemLine";
import { CLASSPREFIX as eccgui } from "@/configuration/constants";

export interface CardTitleProps extends Omit<OverviewItemLineProps, "small" | "large"> {
    /**
     * Use only normal font size instead of a large one.
     */
    narrowed?: boolean;
}

/**
 * Display a card title, can include other markup like `h2`, `h3` and so on to define document structure.
 */
export const CardTitle = ({ children, className = "", narrowed = false, ...otherProps }: CardTitleProps) => {
    return (
        <OverviewItemLine
            {...otherProps}
            className={cn(
                `${eccgui}-card__title`,
                // per-intent text color is applied at the call site (`Dialog/SimpleDialog.tsx` passes a
                // `text-<intent>` className, since the `intent` value is only known there);
                // 16px (OverviewItemLine `large`) semibold + tight tracking = the standard shadcn CardTitle
                "font-semibold tracking-tight [&>*]:[font-weight:inherit]",
                className,
            )}
            large={!narrowed}
        >
            {children}
        </OverviewItemLine>
    );
};

export default CardTitle;
