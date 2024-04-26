using {
  managed,
  cuid
} from '@sap/cds/common';

namespace de.example;

entity Foos : managed, cuid {
  bar : String;
}
