/**
 * 通过类名获取元素集合
 */
function getClassName(element, className) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(className);
    } else {
        var filterArr = [];
        var elements = element.getElementsByTagName("*");
        for (var i = 0; i < elements.length; i++) {
            var nameArr = elements[i].className.split(" ");
            for (var j = 0; j < nameArr.length; j++) {
                if (nameArr[j] === className) {
                    filterArr.push(elements[i]);
                    break;
                }
            }
        }
        return filterArr;
    }
}
/**
 * 事件对象的兼容处理 
 */
var EventUtil = {
    /**
     * 添加事件兼容处理
     */
    addEvent: function(element, eventName, listener) {
        if (element.addEventListener) {
            element.addEventListener(eventName, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + eventName, listener);
        } else {
            element["on" + eventName] = listener;
            var oldOn = element["on" + eventName];
            if (oldOn) {
                element["on" + eventName] = function() {
                    oldOn();
                    listener();
                };
            } else {
                element["on" + eventName] = listener;
            }
        }
    },
    /**
     * 移除事件兼容处理
     */
    removeEvent: function(element, eventName, listener) {
        if (element.removeEventListener) {
            element.removeEventListener(element, listener, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + eventName, listener);
        } else {
            element["on" + eventName] = null;
        }
    },
    /**
     * 获取event兼容处理
     */
    getEvent: function(event) {
        return event ? event : window.event;
    },
    /**
     * 获取event.target兼容处理
     */
    getTarget: function(event) {
        return event.target || event.srcElement;
    },
    /**
     * 阻止事件默认行为
     */
    preventDefault: function(event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },
    /**
     * 阻止事件冒泡
     */
    stopPropagation: function(event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },
    /**
     * 获取页面X坐标位置
     */
    getPageX: function(event) {
        return event.pageX || event.clientX + document.documentElement.scrollLeft;
    },
    /**
     * 获取页面Y坐标位置
     */
    getPageY: function(event) {
        return event.pageY || event.clientY + document.documentElement.scrollTop;
    },
    /**
     * mouseout和mouseover 的relatedTarget 属性兼容	
     */
    getRelatedTarget: function(event) {
        if (event.relatedTarget) {
            return event.relatedTarget;
        } else if (event.toElement) {
            return event.toElement;
        } else if (event.fromElement) {
            return event.fromElement;
        } else {
            return null;
        }
    },
    /**
     * button 按钮事件兼容
     * IE8之前的button属性
     * 0：表示没有按下按钮
     * 1：表示按下了主鼠标按钮
     * 2：表示按下了次鼠标按钮
     * 3：表示同时按下了主、次鼠标按钮
     * 4：表示按下了中间的鼠标按钮
     * 5：表示同时按下了主鼠标按钮和中间的鼠标按钮
     * 6：表示同时按下了次鼠标按钮和中间的鼠标按钮
     * 7：表示同时按下了三个鼠标按钮
     */
    getButton: function(event) {
        if (document.implementation.hasFeature("MouseEvents", "2.0")) {
            return event.button;
        } else {
            switch (event.button) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 7:
                    return 0;
                case 2:
                case 6:
                    return 2;
                case 4:
                    return 1;
            }
        }
    },
    /**
     * 获取输入keyCode的兼容
     */
    getCharCode: function(event) {
        if (typeof event.charCode == "number") {
            return event.charCode;
        } else {
            return event.keyCode;
        }
    },
    /**
     * 获取剪贴板中的数据
     */
    getClipboardText: function(event) {
        var clipboardData = (event.clipboardData || window.clipboardData);
        return clipboardData.getData("text");
    },
    /**
     * 设置剪贴板中的数据
     */
    setClipboardText: function(event, value) {
        if (event.clipboardData) {
            return event.clipboardData.setData("text/plain", value);
        } else if (window.clipboardData) {
            return window.clipboardData.setData("text/plain", value);
        }
    },
};
/**
 * 获取元素兼容
 */
var GetElementUtil = {
    /**
     * 获取最后一个子元素兼容
     */
    getLastElement: function(element) {
        if (element.lastElementChild) {
            return element.lastElementChild;
        } else {
            var node = element.lastChild;
            while (node && node.nodeType !== 1) {
                node = node.previousSibling;
            }
            return node;
        }
    },
    /**
     * 获取第一个子元素兼容
     */
    getFirstElement: function(element) {
        if (element.firstElementChild) {
            return element.firstElementChild;
        } else {
            var node = element.firstChild;
            while (node && node.nodeType !== 1) {
                node = node.nextSibling;
            }
            return node;
        }
    },
    /**
     * 获取下一个兄弟元素
     */
    getNextElement: function(element) {
        if (element.nextElementSibling) {
            return element.nextElementSibling;
        } else {
            var next = element.nextSibling;
            while (next && next.nodeType !== 1) {
                next = next.nextSibling;
            }
            return next;
        }
    },
    /**
     * 获取上一个兄弟元素
     */
    getPreviousElement: function(element) {
        if (element.previousElementSibling) {
            return element.previousElementSibling;
        } else {
            var prev = element.previousSibling;
            while (prev && prev.nodeType !== 1) {
                prev = prev.previousSibling;
            }
            return prev;
        }
    }
};
/**
 * 设置(获取)标签内部文本兼容
 */
var TextUtil = {
    get: function(element) {
        if (typeof element.innerText === "string") {
            return element.innerText;
        } else {
            return element.textContent;
        }
    },
    set: function(element, content) {
        if (typeof element.innerText === "string") {
            element.innerText = content;
        } else {
            element.textContent = content;
        }
    }
};
/**
 * 获取样式兼容
 */
var StyleUtil = {
    /**
     * 获取浏览器视口大小兼容
     */
    getViewport: function() {
        if (document.compatMode == "BackCompat") {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            };
        } else {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        }
    },
    /**
     * 获取样式兼容方式
     */
    getStyle: function(obj, attr) {
        if (window.getComputedStyle) {
            return window.getComputedStyle(obj, null)[attr];
        } else {
            return obj.currentStyle[attr];
        }
    },
    /**
     * 获取页面被卷去的头部高度和左侧宽度
     * 用法scroll().top/left；
     */
    scroll: function() {
        return {
            top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
        };
    },
    /**
     * 获取网页可视区的宽度和高度
     * 用法client().width/height；
     */
    client: function() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
        };
    },
    /**
     * 替换类名
     */
    replaceClassName: function(element, oldStr, newStr) {
        var nameArr = element.className.split(" ");
        for (var i = 0; i < nameArr.length; i++) {
            if (nameArr[i] === oldStr) {
                nameArr[i] = newStr;
            }
        }
        element.className = nameArr.join(" ");
    }
};