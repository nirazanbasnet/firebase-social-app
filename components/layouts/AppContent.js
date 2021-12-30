import React from "react";

function AppContent({ className, children, ...props }) {
	return <div {...props}>{children}</div>;
}

export default AppContent;
