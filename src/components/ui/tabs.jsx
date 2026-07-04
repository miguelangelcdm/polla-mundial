import * as React from "react"
import { Tabs as HeroTabs } from "@heroui/react"

const Tabs = ({ selectedKey, onSelectionChange, variant, color, fullWidth, classNames, children }) => {
  const childrenArray = React.Children.toArray(children);
  
  const getKey = (child) => {
    if (child.props.id) return child.props.id;
    if (child.key) {
      // Strip all non-alphanumeric leading characters (like .$ or ..$ in React 19)
      return child.key.replace(/^[^a-zA-Z0-9_-]+/, '');
    }
    return '';
  };

  // Build the Tab buttons list
  const tabsList = childrenArray.map(child => {
    if (!React.isValidElement(child)) return null;
    const id = getKey(child);
    const title = child.props.title;
    return (
      <HeroTabs.Tab 
        key={id} 
        id={id}
        className={classNames?.tab}
      >
        <span className={classNames?.tabContent}>
          {title}
        </span>
        <HeroTabs.Indicator className={classNames?.cursor} />
      </HeroTabs.Tab>
    );
  }).filter(Boolean);

  // Build the panel content list
  const panelsList = childrenArray.map(child => {
    if (!React.isValidElement(child)) return null;
    const id = getKey(child);
    const content = child.props.children;
    return (
      <HeroTabs.Panel key={id} id={id}>
        {content}
      </HeroTabs.Panel>
    );
  }).filter(Boolean);

  return (
    <HeroTabs
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
      variant={variant}
      color={color}
    >
      <HeroTabs.ListContainer className={fullWidth ? "w-full" : ""}>
        <HeroTabs.List 
          className={classNames?.tabList}
          aria-label="Opciones"
        >
          {tabsList}
        </HeroTabs.List>
      </HeroTabs.ListContainer>

      {panelsList}
    </HeroTabs>
  );
};

const Tab = ({ children }) => {
  return children;
};

export { Tabs, Tab }
