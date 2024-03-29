# @standard-configs

## Sort Order

We sort objects with this order of precedence:

- Overrides at the bottom
  - eg. elint has `overrides`, those go to the bottom of the file.
- Maintainer Conventions.
  - eg. examples in documentation, internal implementation sort orders, etc.
  - If they are wildly inconsistent, we ignore this one. eg. eslint doesn't have any consistency with it's order.
- Consistent Ecosystem Convention
  - This is similar to maintainer's convention, but is determined by the larger community.
  - This does _not_ mean taking a poll. This means consistently similar conventions across many large and smaller projects out in the wild.
- Documentation Order
- [@saiichihashimoto](https://github.com/saiichihashimoto)'s personal opinion.
  - Let's avoid this one.
- Alphabetical
