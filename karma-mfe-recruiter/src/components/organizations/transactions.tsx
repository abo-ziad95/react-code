import Placeholder from "@hatech/karma-core/components/placeholder";
import useApolloQuery from "@hatech/karma-core/hooks/useApolloQuery";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import _ from "lodash";
import moment from "moment";
import React from "react";
import useReactRouter from "use-react-router";
import {GET_TRANSACTIONS} from "../../graphql/transactions";
import AddPoints from "./addPoints";

interface ITransaction {
  [key: string]: any;
}
interface IResults {
  items: ITransaction[];
  nextToken?: string;
}
interface IQueryResult {
  queryKarmaTransactionsByOrganizationDateCreatedIndex: IResults;
}
interface IFetchMoreOptions {
  fetchMoreResult?: IQueryResult;
  variables?: Record<string, any> | undefined;
}

/**
 * Transactions List component return list of transactions with transaction info
 * and calculate total balance
 */
const TransactionsList: React.FC = () => {
  const { match } = useReactRouter();
  const params = match.params as { organizationId: string };
  const organizationId = params.organizationId;
  const query = useApolloQuery(GET_TRANSACTIONS);
  const [transactions, setTransactions] = React.useState<ITransaction[] | undefined | null>();
  const [balance, setBalance] = React.useState(0);

  const effect = () => {
    const variables = {
      organization: organizationId,
      first: 1000
    };
    query.execute({ variables });
  };
  React.useEffect(effect, []);

  const setTransactionsState = () => {
    let items: ITransaction | undefined;
    let runningBalance = 0;
    if (query.data && query.data.queryKarmaTransactionsByOrganizationDateCreatedIndex) {
      items = query.data.queryKarmaTransactionsByOrganizationDateCreatedIndex.items;
    }

    if (!items) {
      return;
    }

    const sortedTransactions = _.sortBy(items, ["date_created"]);
    sortedTransactions.forEach((transaction: ITransaction) => {
      transaction.type === "credit"
        ? (runningBalance += transaction.amount)
        : (runningBalance -= transaction.amount);
      transaction.balance = runningBalance;
    });
    const reverseSortedTransactions = _.sortBy(sortedTransactions, ["date_created"]).reverse();
    setBalance(runningBalance);
    setTransactions(reverseSortedTransactions);
  };
  React.useEffect(setTransactionsState, [
      query.data && query.data.queryKarmaTransactionsByOrganizationDateCreatedIndex.items.length]);

  const fetchMore = () => {
    const variables = {
      after: query.data.queryKarmaTransactionsByOrganizationDateCreatedIndex.nextToken
    };

    const updateQuery = (previousQueryResult: IQueryResult, options: IFetchMoreOptions) => {
      if (!options.fetchMoreResult) {
        return previousQueryResult;
      }

      options.fetchMoreResult.queryKarmaTransactionsByOrganizationDateCreatedIndex.items = [
        ...previousQueryResult.queryKarmaTransactionsByOrganizationDateCreatedIndex.items,
        ...options.fetchMoreResult.queryKarmaTransactionsByOrganizationDateCreatedIndex.items
      ];

      return options.fetchMoreResult;
    };

    const fetchMoreOptions = { variables, updateQuery };
    query.fetchMore(fetchMoreOptions);
  };

  return (
    <div style={{ paddingTop: 12 }}>
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={12}>
          <Card>
            <CardHeader
              title="Transactions"
              subheader={!query.loading ? "Balance: " + balance : <Placeholder variant="text" />}
              action={<AddPoints />}
            />
            <Divider />
            <List>
              {_.isUndefined(transactions) &&
                [1, 2, 3].map(value => (
                  <ListItem key={value} divider={true}>
                    <ListItemText primary={<Placeholder variant="text" />} />
                  </ListItem>
                ))}
              {_.isEmpty(transactions) && !query.loading && (
                <ListItem>
                  <ListItemText primary="No transactions to display" />
                </ListItem>
              )}
              {!_.isEmpty(transactions) && (
                <ListItem divider={true}>
                  <ListItemText primary="Date" className="transaction-list-cell" />
                  <ListItemText primary="Type" className="transaction-list-cell" />
                  <ListItemText primary="Amount" className="transaction-list-cell" />
                  <ListItemText primary="Balance" className="transaction-list-cell" />
                </ListItem>
              )}
              {transactions &&
                transactions.map((transaction, index) => (
                  <ListItem divider={true} key={index}>
                    <ListItemText
                      primary={moment(transaction.date_created)
                        .local()
                        .format("MMM DD YYYY h:mm:ss a")}
                      className={"transaction-list-cell"}
                    />
                    <ListItemText primary={transaction.type} className="transaction-list-cell" />
                    <ListItemText primary={transaction.amount} className="transaction-list-cell" />
                    <ListItemText primary={transaction.balance} className="transaction-list-cell" />
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
        <Grid item={true} xs={12} style={{ textAlign: "center" }}>
          {query.data && query.data.queryKarmaTransactionsByOrganizationDateCreatedIndex && (
            <Button
              color="primary"
              variant="outlined"
              disabled={
                !Boolean(query.data.queryKarmaTransactionsByOrganizationDateCreatedIndex.nextToken)
              }
              onClick={fetchMore}
              id="load-more"
            >
              Load More
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default TransactionsList;
