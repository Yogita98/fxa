import React from 'react';
import Grid from './Grid';
import UserElement from './UserElement';

const Header = () => {
  return (
    <div className="header">
      Copy/paste this code into your registration form.
    </div>
  );
};

const user = {
  userName: 'XYZ',
};

const Fxa = ({ classname }: any) => {
  return (
    <div className={classname}>
      <Grid classname="">
        <Grid.Row classname="border-solid border-4 border-gray-500 ...">
          <img
            src="https://image.e.mozilla.org/lib/fe9915707361037e75/m/4/11c1e411-7dfe-4e04-914c-0f098edac96c.png"
            alt="firefox logo"
            className="fx-logo"
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Cell classname="border-dashed border-4 border-gray-200 ...">
            <UserElement user={user} classname="" />
          </Grid.Cell>
        </Grid.Row>
        <Grid.Row classname="border-double border-4 border-black ...">
          <p className="para">
            Mozilla. 2 Harrison St, #175, San Francisco, CA 94105
            <br />
            <a
              href="https://www.mozilla.org/about/legal/terms/services/" //privacy URL
              className="privacy-url"
            >
              Mozilla Privacy Policy
            </a>
            <br />
            <a
              href="https://www.mozilla.org/about/legal/terms/services/"
              className="privacy-URL"
            >
              Firefox Cloud Terms of Service
            </a>
          </p>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Fxa;
