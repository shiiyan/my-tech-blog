# Design Pattern For Bulk Insert

For original contents, refer to the following link.

https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/april/design-patterns-for-data-persistence

## TL;DR

Both Active Record Pattern and Repository Pattern can deal with bulk insert. The right way to perform a bulk insert in Repository Pattern is combining Command Pattern and Specification Pattern with it. ̰

## ORM

```c#
public class Address {
  public long Id
  { get; set; }
  public string Address1
  { get; set; }
  public string Address2
  { get; set; }
  public string City
  { get; set; }
  public string StateOrProvince
  { get; set; }
  public string Country
  { get; set; }
  public string PostalCode
  { get; set; }
  public string TimeZone
  { get; set; }
}
```

```c#
public class AddressMap:ClassMap<Address>
{
  public AddressMap() {
    WithTable("Address");
    UseIdentityForKey(x => x.Id, "id");
    Map(x => x.Address1).TheColumnNameIs("address1");
    Map(x => x.Address2).TheColumnNameIs("address2");
    Map(x => x.City).TheColumnNameIs("city");
    Map(x => x.StateOrProvince).TheColumnNameIs("province_code");
    Map(x => x.Country).TheColumnNameIs("country_name");
    Map(x => x.PostalCode).TheColumnNameIs("postal_code");
  }
}
```

## Data access patterns

### Active Record

```C#
class Address < ActiveRecord::Base end
```

> An Active Record approach encapsulates persistence methods derectly onto the entity object.

An object in Active Record pattern represents a row in a database table.

### Data Mapper

> With a Data Mapper pattern, you access, query and save entity objects with some kind of repository.

Repository is one kind of Data Mapper.



## How to deal with bulk insert

A saveAll method inside a repository.

Repository pattern combined with unit of work pattern.

A good answer.

> Unit Of Work is used when you have multiple repositories. It keeps track of all changes in a transaction until you call Commit method to persist all changes to database.

https://stackoverflow.com/a/14264356

Repository with bulk update

https://enterprisecraftsmanship.com/posts/ddd-bulk-operations/

```java
public class SetExecutionDateCommand : Command<Task>
{
    private readonly DateTime _executionDate;

    public SetExecutionDateCommand(
        DateTime executionDate, params Specification<Task>[] restrictions)
        : base(restrictions)
    {
        _executionDate = executionDate;
    }

    protected override IEnumerable<Specification<Task>> GetPreconditions()
    {
        yield return new TaskIsCompletedSpecification().Not();
    }

    protected override void ExecuteCore(Task entity)
    {
        entity.ExecutionDate = _executionDate;
    }

    protected override string GetTableName()
    {
        return "dbo.Task";
    }

    protected override string ToSqlCore()
    {
        return "ExecutionDate = @ExecutionDate";
    }

    protected override IEnumerable<SqlParameter> ToSqlParametersCore()
    {
        yield return new SqlParameter("ExecutionDate", _executionDate);
    }
}
```

```java
// SetExecutionDateService
public void SetExecutionDate(int month, string category, DateTime executionDate)
{
    var monthSpec = new TaskMonthSpecification(month);          '1
    var categorySpec = new TaskCategorySpecification(category); '1

    var command = new SetExecutionDateCommand(executionDate, monthSpec, categorySpec);

    _repository.BulkUpdate(command);
}

// TaskRepository
public void BulkUpdate(SetExecutionDateCommand command)
{
    using (DbCommand dbCommand = _session.Connection.CreateCommand())
    {
        dbCommand.CommandText = command.ToSql();
        dbCommand.Parameters.AddRange(command.ToSqlParameters().ToArray());

        dbCommand.ExecuteNonQuery();
    }
}
```
