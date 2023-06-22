const findParentsNodeByName = (node, widgetName, parentIds = []) => {
  console.log(" XXXXXXXXXXXXXXXX findParentsNodeByName : ", node, widgetName);

  if (node.name === widgetName && node.type === "widget") {
    return [...parentIds, node.nodeId];
  }

  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      const result = findParentsNodeByName(child, widgetName, [
        ...parentIds,
        node.nodeId,
      ]);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export default findParentsNodeByName;
