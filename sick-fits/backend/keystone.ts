import { createAuth } from '@keystone-next/auth';
import  { config, createSchema } from '@keystone-next/keystone/schema';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import 'dotenv/config';
 
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';

import { insertSeedData } from  './seed-data/index';
import { sendPasswordResetEmail } from './lib/mail';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360,  // How long they stay signed in?
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: Add in initial roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity)
    },
  },
});

const statelessSession = statelessSessions(sessionConfig)

const authConfig =  config({
  // @ts-ignore
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
     adapter: 'mongoose',
     url: databaseURL,
    async onConnect({ keystone }) {      
      if (process.argv.includes('--seed-data')) {
        await insertSeedData(keystone);
      }
      console.log('\n\n Connected to the database ... \n\n')
    },
  },
  lists: createSchema({
      // Schema items go in here
      User: User,
      Product: Product,
      ProductImage: ProductImage,
    }),
  ui: {
    // Show the UI for people who pass this test
    isAccessAllowed: ({ session }) => {
      return !!session?.data;
    },
  },
  session: withItemData(statelessSession, { 
    // GraphQL Query
    User: `id name email`
  }),
})

export default withAuth(authConfig)
