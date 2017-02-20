检测字符串是否为合法的JSON字符串，如果出错，报告第一处出错的位置与字符。

```javascript
var checker = new JsonChecker();
var str = '{"key": "value"}';
checker.check(str);
```
