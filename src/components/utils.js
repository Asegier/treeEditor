export const flatten = (treeObj, idAttr, parentAttr, childrenAttr, levelAttr) => {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parentID';
    if (!childrenAttr) childrenAttr = 'children';
    if (!levelAttr) levelAttr = 'level';
;
    console.log('OBJECT', treeObj)


    function flattenChild(childObj, parentId, level) {
        var array = [];

        var childCopy = Object.assign({}, childObj);
        childCopy[levelAttr] = level;
        childCopy[parentAttr] = parentId;
        delete childCopy[childrenAttr];
        array.push(childCopy);

        array = array.concat(processChildren(childObj, level));

        return array;
    };

    function processChildren(obj, level) {
        if (!level) level = 0;
        var array = [];

        obj[childrenAttr] && obj[childrenAttr].forEach(function(childObj) {
            array = array.concat(flattenChild(childObj, obj[idAttr], level+1));
        });

        return array;
    };

    var result = processChildren(treeObj);
    //var result = flattenChild(treeObj, treeObj[idAttr], 0)[0];

    // add the root object to the array
    var rootCopy = Object.assign({}, treeObj);
    rootCopy[levelAttr] = 0;
    delete rootCopy[childrenAttr];
    result.push(rootCopy)

    console.log('FLAT OBJECT', result);


    return result;
};