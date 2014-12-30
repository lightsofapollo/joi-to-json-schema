# joi-to-json-schema

The goal is to provide best effort conversion from Joi objects to json
schema with the understanding that only some of the schematics can be
converted. Primarily this exists to convert Joi schema objects to existing
tools which happen to currently consume json schema.

## Usage

```js
var Joi = require('joi');
var convert = require('joi-to-json-schema');

// Or whatever joi thing ...
convert(Joi.string()); // => json schema
```

See tests for current conversions and coverage.

## LICENSE

Copyright 2014, Mozilla Foundation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
