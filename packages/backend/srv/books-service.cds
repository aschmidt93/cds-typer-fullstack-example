using {de.example as schema} from '../db/schema';


service BooksService @(path: '/api/v1/books/') {
    /**
     * Only required for exposing the path as a constant to the frontend
     */
    type Endpoint : String enum {
        path = '/api/v1/books/'
    }

    entity Books as projection on schema.Books;
    /**
     * Example function with parameters
     */
    function someFunction(options : ExampleParams, id : String) returns array of Books;
    /**
     * Example action with params and object as return type
     */
    action   someAction(params : ExampleParams, name : String)  returns ExampleType;
    action   actionWithNoReturn();
    action   actionWithImportedEnum(val : schema.MyEnum)        returns String;

    type ExampleParams {
        param1 : Integer;
        param2 : String;
    }

    type ExampleType {
        date : DateTime;
        val  : String;
    }

}
