// Mock user data for the dashboard
export const mockUserData = {
  // Owned assets
  ownedAssets: [
    {
      assetId: "1",
      amount: 500,
      purchaseDate: "2024-03-15",
    },
    {
      assetId: "3",
      amount: 1000,
      purchaseDate: "2024-04-02",
    },
    {
      assetId: "5",
      amount: 200,
      purchaseDate: "2024-04-20",
    },
  ],

  // Staked assets
  stakedAssets: [
    {
      assetId: "1",
      amount: 300,
      stakeDate: "2024-03-20",
      claimableRewards: 5.25,
    },
    {
      assetId: "2",
      amount: 150,
      stakeDate: "2024-04-05",
      claimableRewards: 1.8,
    },
  ],

  // User activities
  activities: [
    {
      id: "act1",
      type: "buy",
      assetId: "1",
      title: "Bought JKOC",
      description: "Purchased 500 JKOC tokens",
      time: "2 days ago",
      txHash: "0x1234567890abcdef1234567890abcdef12345678",
    },
    {
      id: "act2",
      type: "stake",
      assetId: "1",
      title: "Staked JKOC",
      description: "Staked 300 JKOC tokens",
      time: "1 day ago",
      txHash: "0x2345678901abcdef2345678901abcdef23456789",
    },
    {
      id: "act3",
      type: "buy",
      assetId: "3",
      title: "Bought DIBN",
      description: "Purchased 1000 DIBN tokens",
      time: "12 hours ago",
      txHash: "0x3456789012abcdef3456789012abcdef34567890",
    },
    {
      id: "act4",
      type: "stake",
      assetId: "2",
      title: "Staked RENF",
      description: "Staked 150 RENF tokens",
      time: "6 hours ago",
      txHash: "0x4567890123abcdef4567890123abcdef45678901",
    },
    {
      id: "act5",
      type: "claim",
      assetId: "1",
      title: "Claimed Rewards",
      description: "Claimed 2.5 JKOC tokens as rewards",
      time: "3 hours ago",
      txHash: "0x5678901234abcdef5678901234abcdef56789012",
    },
    {
      id: "act6",
      type: "buy",
      assetId: "5",
      title: "Bought BLRS",
      description: "Purchased 200 BLRS tokens",
      time: "1 hour ago",
      txHash: "0x6789012345abcdef6789012345abcdef67890123",
    },
  ],

  // Notifications
  notifications: [
    {
      id: "notif1",
      type: "transaction",
      title: "Purchase Successful",
      message: "Your purchase of 200 BLRS tokens was successful.",
      time: "1 hour ago",
      read: false,
      actionUrl: "/asset/5",
      actionText: "View Asset",
    },
    {
      id: "notif2",
      type: "staking",
      title: "Staking Rewards Available",
      message:
        "You have 5.25 JKOC tokens available to claim as staking rewards.",
      time: "3 hours ago",
      read: false,
      actionUrl: "/dashboard?tab=staked",
      actionText: "Claim Rewards",
    },
    {
      id: "notif3",
      type: "asset",
      title: "Asset Price Alert",
      message: "DIBN price has increased by 5% in the last 24 hours.",
      time: "12 hours ago",
      read: true,
      actionUrl: "/asset/3",
      actionText: "View Asset",
    },
    {
      id: "notif4",
      type: "system",
      title: "New Feature Available",
      message: "Portfolio analytics is now available on your dashboard.",
      time: "1 day ago",
      read: true,
      actionUrl: "/dashboard",
      actionText: "View Dashboard",
    },
    {
      id: "notif5",
      type: "transaction",
      title: "Staking Successful",
      message: "Your staking of 150 RENF tokens was successful.",
      time: "1 day ago",
      read: true,
      actionUrl: "/asset/2",
      actionText: "View Asset",
    },
    {
      id: "notif6",
      type: "system",
      title: "Account Security",
      message:
        "We recommend enabling two-factor authentication for your account.",
      time: "2 days ago",
      read: false,
      actionUrl: "/settings/security",
      actionText: "Enable 2FA",
    },
  ],
};
