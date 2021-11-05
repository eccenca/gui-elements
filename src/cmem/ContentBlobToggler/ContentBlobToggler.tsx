import React, {useState} from "react";
import {Link, Spacing} from "../../../index";

interface IContentBlobTogglerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
        space-delimited list of class names
    */
  className?: string;
  /**
        text label used for toggler when preview is displayed
    */
  toggleExtendText: string;
  /**
        text label used for toggler when full view is displayed
    */
  toggleReduceText: string;
  /**
        content that is displayed as preview
    */
  previewContent: React.ReactNode;
  /**
        content that is displayed as extended full view
    */
  fullviewContent: React.ReactNode;
  /**
        Show extended full view initially. Default: false
    */
  startExtended?: boolean;
  /**
        Callback if toggler is necessary. Default: true
    */
  enableToggler?: boolean;
}

/** Shows a preview with the option to expand to a full view (and back). */
export function ContentBlobToggler({
  className = "",
  toggleExtendText,
  toggleReduceText,
  previewContent,
  fullviewContent,
  startExtended = false,
  enableToggler = true,
  ...otherProps
}: IContentBlobTogglerProps) {
  const [isExtended, setViewState] = useState(startExtended);
  const handlerToggleView = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setViewState(!isExtended);
  };

  return (
    <div className={className} {...otherProps}>
        {!isExtended ? (
          <>
            {previewContent}
            {enableToggler && (
              <>
                &hellip;{" "}
                <Link
                  href="#more"
                  data-test-id={"content-blob-toggler-more-link"}
                  onClick={(e) => {
                    handlerToggleView(e);
                  }}
                >
                  {toggleExtendText}
                </Link>
              </>
            )}
          </>
        ) : (
          <>
            {fullviewContent}
            {enableToggler && (
                <div>
                    <Spacing size="small" />
                    <Link
                        data-test-id={"content-blob-toggler-less-link"}
                        href="#less"
                        onClick={(e) => {
                            handlerToggleView(e);
                        }}
                    >
                        {toggleReduceText}
                    </Link>
                </div>
            )}
          </>
        )}
    </div>
  );
}
