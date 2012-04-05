[Thoth](http://thoth.io)
---

Free open public create-read database.  
Thanks to [Jed Schmidt](http://who.jed.is) for [Dynamo module](https://github.com/jed/dynamo).

Dev
===

Add AWS credentials to __access.json__ like this:

```JSON
{
  "accessKeyId": "...",
  "secretAccessKey": "..."
}
```

Run __make__ to execute tests. These are integration tests and will actually create thoths.
