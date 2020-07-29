import React from "react";
import { CLASSPREFIX as eccgui } from "../../configuration/constants";

function Divider({ addSpacing = "none" }: any) {
    return <hr className={`${eccgui}-separation__divider-horizontal ${eccgui}-separation__spacing--${addSpacing}`} />;
}

export default Divider;
