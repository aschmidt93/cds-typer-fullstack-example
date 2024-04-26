using {
  managed,
  cuid
} from '@sap/cds/common';

namespace de.example;

entity Books : managed, cuid {
  name   : String;
  year   : Integer;
  author : Association to one Authors;
};

entity Authors : managed, cuid {
  firstName : String;
  lastName  : String;
}

type MyEnum : String enum {
  ONE;
  TWO
}
