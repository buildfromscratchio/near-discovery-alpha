function createFileTree(arr) {
  // V1 - start
  // const fileTree = [];
  // for (const item of arr) {
  //   const parts = item.name.split(".");
  //   let current = fileTree;
  //   let found = false;
  //   for (const part of parts) {
  //     let node = current.find(
  //       (obj) => obj.name === part && obj.type === "folder"
  //     );
  //     if (!node) {
  //       node = { name: part, type: "folder", children: [] };
  //       current.push(node);
  //     }
  //     current = node.children;
  //   }
  //   if (item.type === "widget") {
  //     current.push(item);
  //     found = true;
  //   }
  //   if (!found) {
  //     const existingNode = current.find((obj) => obj.name === item.name);
  //     if (existingNode) {
  //       existingNode.children.push(item);
  //     } else {
  //       current.push(item);
  //     }
  //   }
  // }
  // return fileTree;
  // V2 - end
  //
  // V3 - start
  // const fileTree = [];
  // let id = 1; // Initialize unique ID counter
  // for (const item of arr) {
  //   const parts = item.name.split(".");
  //   let current = fileTree;
  //   let found = false;
  //   for (const part of parts) {
  //     let node = current.find(
  //       (obj) => obj.name === part && obj.type === "folder"
  //     );
  //     if (!node) {
  //       const nodeId = id++; // Generate unique ID for node
  //       node = { id: nodeId, name: part, type: "folder", children: [] };
  //       current.push(node);
  //     }
  //     current = node.children;
  //   }
  //   if (item.type === "widget") {
  //     const itemId = id++; // Generate unique ID for item
  //     item.id = itemId;
  //     current.push(item);
  //     found = true;
  //   }
  //   if (!found) {
  //     const existingNode = current.find((obj) => obj.name === item.name);
  //     if (existingNode) {
  //       const itemId = id++; // Generate unique ID for item
  //       item.id = itemId;
  //       existingNode.children.push(item);
  //     } else {
  //       const itemId = id++; // Generate unique ID for item
  //       item.id = itemId;
  //       current.push(item);
  //     }
  //   }
  // }
  // return fileTree;
  // V3 - end
  //

  // V4 - Start
  // const fileTree = [];

  // let id = 1; // Initialize unique ID counter

  // for (const item of arr) {
  //   if (typeof item === "string") return;

  //   const parts = item.name.split(".");
  //   let current = fileTree;
  //   let found = false;

  //   for (const part of parts) {
  //     let node = current.find(
  //       (obj) => obj.name === part && obj.type === "folder"
  //     );
  //     if (!node) {
  //       const nodeId = id++; // Generate unique ID for node
  //       node = {
  //         nodeId: nodeId,
  //         name: part,
  //         type: "folder",
  //         children: [],
  //       };
  //       current.push(node);
  //     }
  //     current = node.children;
  //   }

  //   if (item.type === "widget") {
  //     const itemId = id++; // Generate unique ID for item
  //     // item.nodeId = itemId;
  //     current.push(item);
  //     found = true;
  //   }

  //   if (!found) {
  //     const existingNode = current.find((obj) => obj.name === item.name);
  //     if (existingNode) {
  //       const itemId = id++; // Generate unique ID for item
  //       item.nodeId = itemId;
  //       existingNode.children.push(item);
  //     } else {
  //       const itemId = id++; // Generate unique ID for item
  //       item.nodeId = itemId;
  //       current.push(item);
  //     }
  //   }
  // }

  // // Remove folders with only one child
  // removeSingleChildFolders(fileTree);

  // return fileTree;
  // V4 - end

  // V5 - strart
  // const fileTree = [];

  // let id = 1; // Initialize unique ID counter

  // for (const item of arr) {
  //   const parts = item.name.split(".");
  //   let current = fileTree;
  //   let found = false;

  //   for (const part of parts) {
  //     let node = current.find(
  //       (obj) => obj.name === part && obj.type === "folder"
  //     );
  //     if (!node) {
  //       const nodeId = id++; // Generate unique ID for node
  //       node = { id: nodeId, name: part, type: "folder", children: [] };
  //       current.push(node);
  //     }
  //     current = node.children;
  //   }

  //   if (item.type === "widget") {
  //     const itemId = id++; // Generate unique ID for item
  //     item.id = itemId;
  //     current.push(item);
  //     found = true;
  //   }

  //   if (!found) {
  //     const existingNode = current.find((obj) => obj.name === item.name);
  //     if (existingNode) {
  //       const itemId = id++; // Generate unique ID for item
  //       item.id = itemId;
  //       existingNode.children.push(item);
  //     } else {
  //       const itemId = id++; // Generate unique ID for item
  //       item.id = itemId;
  //       current.push(item);
  //     }
  //   }
  // }

  // return removeSingleChildFolders(fileTree); // Remove single child folders

  // V5 - end

  //
  // V1 - start
  // const fileTree = {};
  // for (const item of arr) {
  //   const parts = item.name.split(".");
  //   let current = fileTree;
  //   for (const part of parts) {
  //     if (!current[part]) {
  //       current[part] = {};
  //     }
  //     current = current[part];
  //   }
  //   if (item.type === "widget") {
  //     current = Object.assign(current, item);
  //   }
  // }
  // return fileTree;
  // V1 - end

  // // V6 - start
  // const fileTree = [];

  // let id = 1; // Initialize unique ID counter

  // for (const item of arr) {
  //   if (typeof item === "string") return;

  //   const parts = item.name.split(".");
  //   let current = fileTree;
  //   let found = false;

  //   for (const part of parts) {
  //     let node = current.find(
  //       (obj) => obj.name === part && obj.type === "folder"
  //     );
  //     if (!node) {
  //       const nodeId = id++; // Generate unique ID for node
  //       node = { nodeId, name: part, type: "folder", children: [] };
  //       current.push(node);
  //     }
  //     current = node.children;
  //   }

  //   if (item.type === "widget") {
  //     // const itemId = id++; // Generate unique ID for item
  //     // item.nodeId = itemId;
  //     current.push(item);
  //     found = true;
  //   }

  //   if (!found) {
  //     const existingNode = current.find((obj) => obj.name === item.name);
  //     if (existingNode) {
  //       const itemId = id++; // Generate unique ID for item
  //       item.nodeId = itemId;
  //       existingNode.children.push(item);
  //     } else {
  //       const itemId = id++; // Generate unique ID for item
  //       item.nodeId = itemId;
  //       current.push(item);
  //     }
  //   }
  // }

  // return removeSingleChildFolders(fileTree); // Remove single child folders
  // // V6 - end

  // V7 - end
  // Sort the array alphabetically by name
  arr.sort((a, b) => a?.name?.localeCompare(b.name));

  const fileTree = [];

  let id = 1; // Initialize unique ID counter

  for (const item of arr) {
    // if (!item) return;
    if (typeof item === "string") return;

    const parts = item.name.split(".");
    let current = fileTree;
    let found = false;

    for (const part of parts) {
      let node = current.find(
        (obj) => obj.name === part && obj.type === "folder"
      );
      if (!node) {
        const nodeId = id++; // Generate unique ID for node
        node = { nodeId, name: part, type: "folder", children: [] };
        current.push(node);
      }
      current = node.children;
    }

    if (item.type === "widget") {
      // const itemId = id++; // Generate unique ID for item
      // item.id = itemId;
      current.push({ type: item.type, name: item.name, unnamed: item.unnamed });
      found = true;
    }

    if (!found) {
      const existingNode = current.find((obj) => obj.name === item.name);
      if (existingNode) {
        const itemId = id++; // Generate unique ID for item
        item.nodeId = itemId;
        existingNode.children.push(item);
      } else {
        const itemId = id++; // Generate unique ID for item
        item.nodeId = itemId;
        current.push(item);
      }
    }
  }

  return removeSingleChildFolders(fileTree); // Remove single child folders
  // V7 - start
}

// v6
function removeSingleChildFolders(tree) {
  const result = [];
  if (tree && tree?.length > 0) {
    for (const node of tree) {
      if (
        node.type === "folder" &&
        node.children.length === 1 &&
        node.children[0].type !== "folder"
      ) {
        result.push(...removeSingleChildFolders(node.children));
      } else {
        node.children = removeSingleChildFolders(node.children);
        result.push(node);
      }
    }
  }
  return result;
}

// v5
// function removeSingleChildFolders(tree) {
//   const result = [];
//   if (tree?.length > 0) {
//     for (const node of tree) {
//       if (node.type === "folder" && node.children.length === 1) {
//         result.push(...removeSingleChildFolders(node.children));
//       } else {
//         node.children = removeSingleChildFolders(node.children);
//         result.push(node);
//       }
//     }
//   }
//   return result;
// }

// // v4
// function removeSingleChildFolders(tree) {
//   for (let i = 0; i < tree?.length; i++) {
//     const node = tree[i];
//     if (node.type === "folder" && node.children.length === 1) {
//       // Move child item to parent's position
//       tree[i] = node.children[0];
//       // Recursively remove single child folders from the child item
//       removeSingleChildFolders(tree[i].children);
//     } else {
//       // Recursively remove single child folders from current node's children
//       removeSingleChildFolders(node.children);
//     }
//   }
// }

export default createFileTree;
