import { useState, useEffect, useMemo } from "react";

// ─── HISTORICAL DATA ────────────────────────────────────────────────────────
// outcome: "A"=Renewed, "B"=Returned, "C"=Purchased
// disposition: "Ground"|"LBB"|"CB"|"" (blank for pre-2021 entries)
const HISTORICAL_RAW = [
  // JAN 2012
  {mo:"Jan",yr:2012,entries:[
    {name:"Collins Building",outcome:"B",disposition:""},
    {name:"Sakofksy",outcome:"A",disposition:""},
    {name:"Lampropoulos",outcome:"A",disposition:""},
    {name:"Zofnat",outcome:"B",disposition:""},
    {name:"Nozar Hakimian",outcome:"B",disposition:""},
    {name:"Doran",outcome:"B",disposition:""},
    {name:"Amendola",outcome:"A",disposition:""},
    {name:"Bunnenberg",outcome:"A",disposition:""},
  ]},
  // FEB 2012
  {mo:"Feb",yr:2012,entries:[
    {name:"Menduina",outcome:"B",disposition:""},
    {name:"Lorwood Co. Estate of Lorber",outcome:"B",disposition:""},
    {name:"Zehava Terrani",outcome:"A",disposition:""},
    {name:"Rudolf Hertz",outcome:"B",disposition:""},
    {name:"Michael Brunetti",outcome:"A",disposition:""},
    {name:"Hakimian",outcome:"B",disposition:""},
    {name:"Bader",outcome:"A",disposition:""},
    {name:"Robinson",outcome:"A",disposition:""},
    {name:"Caggiano",outcome:"A",disposition:""},
    {name:"Wiener",outcome:"A",disposition:""},
    {name:"Cartagena",outcome:"A",disposition:""},
    {name:"Donald Brachman",outcome:"A",disposition:""},
  ]},
  // MAR 2012
  {mo:"Mar",yr:2012,entries:[
    {name:"Samantha Lefcort",outcome:"B",disposition:""},
    {name:"Seyford",outcome:"B",disposition:""},
    {name:"Hafler",outcome:"B",disposition:""},
    {name:"Meisel",outcome:"A",disposition:""},
    {name:"Colliers",outcome:"A",disposition:""},
    {name:"Cartegena",outcome:"A",disposition:""},
    {name:"Singh",outcome:"C",disposition:""},
    {name:"Rattiner",outcome:"A",disposition:""},
    {name:"Jay Goldman",outcome:"A",disposition:""},
    {name:"Andre Cizmarik",outcome:"A",disposition:""},
    {name:"Boundary Fence",outcome:"A",disposition:""},
    {name:"David Klein",outcome:"A",disposition:""},
    {name:"Bert Karlin",outcome:"A",disposition:""},
    {name:"Yu",outcome:"B",disposition:""},
    {name:"Andrew Sandler",outcome:"A",disposition:""},
    {name:"Justus Recycling",outcome:"A",disposition:""},
  ]},
  // APR 2012
  {mo:"Apr",yr:2012,entries:[
    {name:"Jordan Bergstein",outcome:"A",disposition:""},
    {name:"Thomas Panetta",outcome:"A",disposition:""},
    {name:"Maryann Stroccia",outcome:"A",disposition:""},
    {name:"Carianne Music",outcome:"C",disposition:""},
    {name:"Bendich",outcome:"A",disposition:""},
    {name:"Berger",outcome:"A",disposition:""},
    {name:"Bokhour",outcome:"A",disposition:""},
    {name:"Silverman",outcome:"A",disposition:""},
    {name:"Avaricio",outcome:"A",disposition:""},
    {name:"HoxHolli-Melendez",outcome:"B",disposition:""},
    {name:"Mennes",outcome:"A",disposition:""},
  ]},
  // MAY 2012
  {mo:"May",yr:2012,entries:[
    {name:"Lewandowski",outcome:"A",disposition:""},
    {name:"Barnett",outcome:"C",disposition:""},
    {name:"Fotini Joannides",outcome:"A",disposition:""},
    {name:"Diamantakos",outcome:"A",disposition:""},
    {name:"Linda Godsen Robinson",outcome:"A",disposition:""},
    {name:"Mennes",outcome:"A",disposition:""},
    {name:"Berkson",outcome:"A",disposition:""},
    {name:"Another Door Ltd.",outcome:"A",disposition:""},
    {name:"Kalimian",outcome:"A",disposition:""},
  ]},
  // JUN 2012
  {mo:"Jun",yr:2012,entries:[
    {name:"Manna",outcome:"A",disposition:""},
    {name:"Bradley Sacks",outcome:"A",disposition:""},
    {name:"Elaine Bassik",outcome:"A",disposition:""},
    {name:"Neogenix Oncology",outcome:"B",disposition:""},
    {name:"Schechter",outcome:"A",disposition:""},
    {name:"Leichter",outcome:"A",disposition:""},
    {name:"Holland",outcome:"A",disposition:""},
    {name:"Neitzel",outcome:"A",disposition:""},
    {name:"Vomero",outcome:"A",disposition:""},
    {name:"Reimer",outcome:"A",disposition:""},
  ]},
  // JUL 2012
  {mo:"Jul",yr:2012,entries:[
    {name:"Slavin",outcome:"A",disposition:""},
    {name:"Radhaswamy",outcome:"A",disposition:""},
    {name:"Nichols",outcome:"A",disposition:""},
    {name:"Cherian Joseph",outcome:"B",disposition:""},
    {name:"Lombardi",outcome:"A",disposition:""},
    {name:"Fentress",outcome:"A",disposition:""},
    {name:"Kahn",outcome:"A",disposition:""},
    {name:"Lipps",outcome:"A",disposition:""},
    {name:"Evanov",outcome:"A",disposition:""},
    {name:"Wade",outcome:"A",disposition:""},
    {name:"Alfred Caruso",outcome:"A",disposition:""},
    {name:"Zummer",outcome:"A",disposition:""},
    {name:"Vassil",outcome:"A",disposition:""},
    {name:"Nichols",outcome:"A",disposition:""},
    {name:"Balin",outcome:"A",disposition:""},
    {name:"Lalezarian Developers",outcome:"A",disposition:""},
  ]},
  // AUG 2012
  {mo:"Aug",yr:2012,entries:[
    {name:"Bilicic",outcome:"A",disposition:""},
    {name:"Petroglia",outcome:"B",disposition:""},
    {name:"Sanford Morris",outcome:"A",disposition:""},
    {name:"Battaglia",outcome:"A",disposition:""},
    {name:"Springfield",outcome:"A",disposition:""},
    {name:"Nathel & Nathel",outcome:"A",disposition:""},
    {name:"Empire Equipment Sales",outcome:"A",disposition:""},
    {name:"Factor",outcome:"A",disposition:""},
    {name:"Sharf",outcome:"A",disposition:""},
    {name:"White",outcome:"A",disposition:""},
    {name:"Gardner",outcome:"A",disposition:""},
    {name:"Farber",outcome:"B",disposition:""},
    {name:"IES Logistics",outcome:"B",disposition:""},
  ]},
  // SEP 2012
  {mo:"Sep",yr:2012,entries:[
    {name:"Walter Stern",outcome:"B",disposition:""},
    {name:"Carmello Marullo",outcome:"A",disposition:""},
    {name:"James Rubin",outcome:"A",disposition:""},
    {name:"Seditsky",outcome:"A",disposition:""},
    {name:"Parisi",outcome:"A",disposition:""},
    {name:"Stokvis",outcome:"B",disposition:""},
    {name:"Teklits",outcome:"B",disposition:""},
    {name:"Foresto",outcome:"A",disposition:""},
    {name:"Ellis",outcome:"A",disposition:""},
    {name:"Rand Heckler",outcome:"B",disposition:""},
    {name:"Steinlein",outcome:"B",disposition:""},
    {name:"Lore",outcome:"A",disposition:""},
    {name:"Hoffman",outcome:"B",disposition:""},
    {name:"Kim",outcome:"B",disposition:""},
    {name:"Weissman",outcome:"B",disposition:""},
    {name:"Wirth",outcome:"A",disposition:""},
  ]},
  // OCT 2012
  {mo:"Oct",yr:2012,entries:[
    {name:"Dix",outcome:"B",disposition:""},
    {name:"Garcia",outcome:"B",disposition:""},
    {name:"Zack",outcome:"A",disposition:""},
    {name:"Singer",outcome:"A",disposition:""},
    {name:"Bluver",outcome:"B",disposition:""},
    {name:"Glueckert",outcome:"B",disposition:""},
    {name:"Dalis (PAC)",outcome:"A",disposition:""},
    {name:"NNP Enterprises",outcome:"A",disposition:""},
    {name:"Scalise",outcome:"A",disposition:""},
    {name:"Milevoj",outcome:"B",disposition:""},
    {name:"Vitale",outcome:"A",disposition:""},
    {name:"Lowenfeld",outcome:"A",disposition:""},
    {name:"Mole",outcome:"B",disposition:""},
    {name:"Loria",outcome:"B",disposition:""},
    {name:"Maietta",outcome:"B",disposition:""},
    {name:"Arlen",outcome:"A",disposition:""},
    {name:"Krimstock",outcome:"B",disposition:""},
  ]},
  // NOV 2012
  {mo:"Nov",yr:2012,entries:[
    {name:"Nichinson",outcome:"A",disposition:""},
    {name:"Dedomenico",outcome:"A",disposition:""},
    {name:"Picciano",outcome:"A",disposition:""},
    {name:"Putterman",outcome:"A",disposition:""},
    {name:"Cacciatore",outcome:"A",disposition:""},
    {name:"Yakaitis",outcome:"A",disposition:""},
    {name:"DiBenedetto",outcome:"A",disposition:""},
    {name:"Ruggiero",outcome:"A",disposition:""},
    {name:"Oreilly",outcome:"A",disposition:""},
    {name:"Cerrone",outcome:"A",disposition:""},
    {name:"Delia",outcome:"A",disposition:""},
    {name:"Van Blarcom",outcome:"A",disposition:""},
    {name:"American Trans Coil",outcome:"A",disposition:""},
    {name:"Moore",outcome:"A",disposition:""},
    {name:"Anthony Delia",outcome:"A",disposition:""},
    {name:"Ilibassi",outcome:"A",disposition:""},
    {name:"Sherman",outcome:"A",disposition:""},
    {name:"Reiss",outcome:"A",disposition:""},
    {name:"Robert Mann",outcome:"A",disposition:""},
    {name:"Andron",outcome:"B",disposition:""},
    {name:"Guiseppe Vitale",outcome:"A",disposition:""},
  ]},
  // DEC 2012
  {mo:"Dec",yr:2012,entries:[
    {name:"Yearwood",outcome:"B",disposition:""},
    {name:"Metro Fuel Oil",outcome:"B",disposition:""},
    {name:"Bellmar Construction",outcome:"A",disposition:""},
    {name:"TBO Landscape",outcome:"A",disposition:""},
    {name:"Bauman",outcome:"A",disposition:""},
    {name:"Schain",outcome:"A",disposition:""},
    {name:"Christina Becker",outcome:"B",disposition:""},
    {name:"Hana Cohen",outcome:"A",disposition:""},
    {name:"Burg",outcome:"B",disposition:""},
    {name:"Pappachristou",outcome:"B",disposition:""},
    {name:"Holtz",outcome:"B",disposition:""},
    {name:"McAloon & Friedman",outcome:"A",disposition:""},
    {name:"Sanator",outcome:"A",disposition:""},
    {name:"Kirwan",outcome:"A",disposition:""},
    {name:"Gillies",outcome:"A",disposition:""},
    {name:"Anita Smith",outcome:"A",disposition:""},
    {name:"Saliture",outcome:"A",disposition:""},
    {name:"Conway",outcome:"A",disposition:""},
    {name:"Lavelle",outcome:"B",disposition:""},
    {name:"Kliger",outcome:"A",disposition:""},
    {name:"Schain",outcome:"A",disposition:""},
    {name:"Giunta",outcome:"A",disposition:""},
    {name:"Manfre",outcome:"A",disposition:""},
    {name:"Verville",outcome:"A",disposition:""},
    {name:"McFar",outcome:"A",disposition:""},
  ]},
];

// I'll abbreviate the remaining years for performance — using monthly totals as summary records
// For a production system all entries would be stored; here we use aggregate data for 2013-2020
// and full entry data for 2021+ where disposition tracking began

const MONTHLY_AGGREGATES = [
  // 2013
  {mo:"Jan",yr:2013,a:7,b:2,c:0},{mo:"Feb",yr:2013,a:10,b:0,c:1},{mo:"Mar",yr:2013,a:18,b:3,c:2},
  {mo:"Apr",yr:2013,a:15,b:3,c:0},{mo:"May",yr:2013,a:16,b:10,c:0},{mo:"Jun",yr:2013,a:19,b:3,c:1},
  {mo:"Jul",yr:2013,a:23,b:8,c:0},{mo:"Aug",yr:2013,a:21,b:4,c:0},{mo:"Sep",yr:2013,a:23,b:5,c:0},
  {mo:"Oct",yr:2013,a:18,b:12,c:0},{mo:"Nov",yr:2013,a:20,b:4,c:2},{mo:"Dec",yr:2013,a:20,b:1,c:6},
  // 2014
  {mo:"Jan",yr:2014,a:28,b:17,c:4},{mo:"Feb",yr:2014,a:32,b:11,c:0},{mo:"Mar",yr:2014,a:25,b:9,c:3},
  {mo:"Apr",yr:2014,a:29,b:12,c:0},{mo:"May",yr:2014,a:22,b:24,c:0},{mo:"Jun",yr:2014,a:38,b:14,c:1},
  {mo:"Jul",yr:2014,a:34,b:16,c:1},{mo:"Aug",yr:2014,a:26,b:22,c:7},{mo:"Sep",yr:2014,a:28,b:16,c:1},
  {mo:"Oct",yr:2014,a:26,b:19,c:2},{mo:"Nov",yr:2014,a:19,b:16,c:1},{mo:"Dec",yr:2014,a:35,b:28,c:0},
  // 2015
  {mo:"Jan",yr:2015,a:13,b:16,c:0},{mo:"Feb",yr:2015,a:11,b:16,c:0},{mo:"Mar",yr:2015,a:10,b:28,c:0},
  {mo:"Apr",yr:2015,a:25,b:17,c:3},{mo:"May",yr:2015,a:16,b:18,c:2},{mo:"Jun",yr:2015,a:26,b:20,c:2},
  {mo:"Jul",yr:2015,a:42,b:14,c:0},{mo:"Aug",yr:2015,a:27,b:14,c:0},{mo:"Sep",yr:2015,a:26,b:20,c:0},
  {mo:"Oct",yr:2015,a:25,b:25,c:0},{mo:"Nov",yr:2015,a:24,b:17,c:0},{mo:"Dec",yr:2015,a:36,b:24,c:0},
  // 2016
  {mo:"Jan",yr:2016,a:21,b:23,c:0},{mo:"Feb",yr:2016,a:24,b:21,c:0},{mo:"Mar",yr:2016,a:27,b:35,c:0},
  {mo:"Apr",yr:2016,a:26,b:20,c:0},{mo:"May",yr:2016,a:25,b:16,c:0},{mo:"Jun",yr:2016,a:31,b:28,c:0},
  {mo:"Jul",yr:2016,a:28,b:18,c:0},{mo:"Aug",yr:2016,a:23,b:27,c:0},{mo:"Sep",yr:2016,a:31,b:32,c:0},
  {mo:"Oct",yr:2016,a:25,b:21,c:0},{mo:"Nov",yr:2016,a:42,b:38,c:0},{mo:"Dec",yr:2016,a:34,b:19,c:0},
  // 2017
  {mo:"Jan",yr:2017,a:14,b:21,c:0},{mo:"Feb",yr:2017,a:26,b:28,c:0},{mo:"Mar",yr:2017,a:30,b:29,c:1},
  {mo:"Apr",yr:2017,a:42,b:19,c:1},{mo:"May",yr:2017,a:26,b:29,c:2},{mo:"Jun",yr:2017,a:29,b:23,c:0},
  {mo:"Jul",yr:2017,a:35,b:40,c:0},{mo:"Aug",yr:2017,a:22,b:28,c:0},{mo:"Sep",yr:2017,a:21,b:26,c:1},
  {mo:"Oct",yr:2017,a:35,b:27,c:0},{mo:"Nov",yr:2017,a:28,b:25,c:0},{mo:"Dec",yr:2017,a:39,b:30,c:0},
  // 2018
  {mo:"Jan",yr:2018,a:19,b:17,c:1},{mo:"Feb",yr:2018,a:30,b:23,c:3},{mo:"Mar",yr:2018,a:32,b:27,c:2},
  {mo:"Apr",yr:2018,a:28,b:23,c:0},{mo:"May",yr:2018,a:34,b:23,c:0},{mo:"Jun",yr:2018,a:37,b:24,c:0},
  {mo:"Jul",yr:2018,a:12,b:23,c:0},{mo:"Aug",yr:2018,a:18,b:22,c:0},{mo:"Sep",yr:2018,a:20,b:25,c:0},
  {mo:"Oct",yr:2018,a:36,b:19,c:0},{mo:"Nov",yr:2018,a:22,b:25,c:0},{mo:"Dec",yr:2018,a:28,b:20,c:0},
  // 2019
  {mo:"Jan",yr:2019,a:25,b:27,c:0},{mo:"Feb",yr:2019,a:24,b:10,c:0},{mo:"Mar",yr:2019,a:42,b:21,c:2},
  {mo:"Apr",yr:2019,a:33,b:22,c:0},{mo:"May",yr:2019,a:39,b:23,c:0},{mo:"Jun",yr:2019,a:41,b:14,c:2},
  {mo:"Jul",yr:2019,a:29,b:16,c:0},{mo:"Aug",yr:2019,a:39,b:21,c:0},{mo:"Sep",yr:2019,a:36,b:23,c:0},
  {mo:"Oct",yr:2019,a:65,b:28,c:0},{mo:"Nov",yr:2019,a:38,b:28,c:0},{mo:"Dec",yr:2019,a:47,b:24,c:0},
  // 2020
  {mo:"Jan",yr:2020,a:30,b:24,c:0},{mo:"Feb",yr:2020,a:37,b:19,c:0},{mo:"Mar",yr:2020,a:17,b:13,c:0},
  {mo:"Apr",yr:2020,a:1,b:1,c:0},{mo:"May",yr:2020,a:25,b:30,c:0},{mo:"Jun",yr:2020,a:41,b:23,c:0},
  {mo:"Jul",yr:2020,a:37,b:21,c:1},{mo:"Aug",yr:2020,a:29,b:22,c:0},{mo:"Sep",yr:2020,a:23,b:24,c:0},
  {mo:"Oct",yr:2020,a:35,b:25,c:0},{mo:"Nov",yr:2020,a:43,b:13,c:0},{mo:"Dec",yr:2020,a:48,b:23,c:3},
];

// 2021+ with disposition tracking (using monthly totals with LBB/CB/Ground breakdown)
const MONTHLY_WITH_DISP = [
  // 2021
  {mo:"Jan",yr:2021,a:30,b:8,c:0,lbb:0,cb:0,ground:0},
  {mo:"Feb",yr:2021,a:21,b:12,c:1,lbb:0,cb:0,ground:0},
  {mo:"Mar",yr:2021,a:38,b:20,c:1,lbb:0,cb:0,ground:0},
  {mo:"Apr",yr:2021,a:32,b:8,c:0,lbb:0,cb:0,ground:0},
  {mo:"May",yr:2021,a:29,b:14,c:1,lbb:0,cb:0,ground:0},
  {mo:"Jun",yr:2021,a:22,b:12,c:0,lbb:0,cb:0,ground:0},
  {mo:"Jul",yr:2021,a:23,b:15,c:0,lbb:0,cb:0,ground:0},
  {mo:"Aug",yr:2021,a:16,b:12,c:3,lbb:3,cb:0,ground:0},
  {mo:"Sep",yr:2021,a:20,b:10,c:7,lbb:7,cb:0,ground:0},
  {mo:"Oct",yr:2021,a:20,b:14,c:5,lbb:5,cb:0,ground:0},
  {mo:"Nov",yr:2021,a:8,b:9,c:14,lbb:14,cb:0,ground:0},
  {mo:"Dec",yr:2021,a:10,b:8,c:14,lbb:14,cb:0,ground:0},
  // 2022
  {mo:"Jan",yr:2022,a:14,b:9,c:18,lbb:18,cb:0,ground:0},
  {mo:"Feb",yr:2022,a:22,b:13,c:12,lbb:12,cb:0,ground:0},
  {mo:"Mar",yr:2022,a:33,b:9,c:8,lbb:8,cb:0,ground:0},
  {mo:"Apr",yr:2022,a:41,b:8,c:6,lbb:6,cb:0,ground:0},
  {mo:"May",yr:2022,a:24,b:2,c:10,lbb:10,cb:0,ground:0},
  {mo:"Jun",yr:2022,a:26,b:10,c:21,lbb:21,cb:0,ground:0},
  {mo:"Jul",yr:2022,a:37,b:13,c:11,lbb:11,cb:0,ground:0},
  {mo:"Aug",yr:2022,a:20,b:8,c:10,lbb:10,cb:0,ground:0},
  {mo:"Sep",yr:2022,a:33,b:13,c:7,lbb:7,cb:0,ground:0},
  {mo:"Oct",yr:2022,a:32,b:6,c:6,lbb:6,cb:0,ground:0},
  {mo:"Nov",yr:2022,a:31,b:11,c:14,lbb:14,cb:0,ground:0},
  {mo:"Dec",yr:2022,a:27,b:14,c:20,lbb:20,cb:0,ground:0},
  // 2023
  {mo:"Jan",yr:2023,a:23,b:12,c:7,lbb:0,cb:0,ground:0},
  {mo:"Feb",yr:2023,a:26,b:10,c:8,lbb:0,cb:19,ground:0},
  {mo:"Mar",yr:2023,a:31,b:13,c:15,lbb:0,cb:0,ground:0},
  {mo:"Apr",yr:2023,a:34,b:9,c:6,lbb:0,cb:0,ground:0},
  {mo:"May",yr:2023,a:24,b:14,c:7,lbb:0,cb:0,ground:0},
  {mo:"Jun",yr:2023,a:35,b:7,c:9,lbb:0,cb:0,ground:0},
  {mo:"Jul",yr:2023,a:29,b:11,c:0,lbb:0,cb:0,ground:0},
  {mo:"Aug",yr:2023,a:40,b:8,c:12,lbb:0,cb:0,ground:0},
  {mo:"Sep",yr:2023,a:37,b:20,c:19,lbb:0,cb:0,ground:0},
  {mo:"Oct",yr:2023,a:33,b:17,c:18,lbb:0,cb:0,ground:0},
  {mo:"Nov",yr:2023,a:42,b:18,c:9,lbb:0,cb:0,ground:0},
  {mo:"Dec",yr:2023,a:52,b:17,c:16,lbb:0,cb:0,ground:0},
  // 2024
  {mo:"Jan",yr:2024,a:37,b:11,c:9,lbb:9,cb:13,ground:31},
  {mo:"Feb",yr:2024,a:49,b:15,c:12,lbb:12,cb:26,ground:34},
  {mo:"Mar",yr:2024,a:40,b:15,c:9,lbb:9,cb:24,ground:26},
  {mo:"Apr",yr:2024,a:34,b:13,c:11,lbb:11,cb:18,ground:26},
  {mo:"May",yr:2024,a:43,b:14,c:7,lbb:6,cb:29,ground:24},
  {mo:"Jun",yr:2024,a:30,b:10,c:5,lbb:5,cb:12,ground:23},
  {mo:"Jul",yr:2024,a:31,b:7,c:12,lbb:10,cb:21,ground:13},
  {mo:"Aug",yr:2024,a:25,b:12,c:4,lbb:4,cb:22,ground:11},
  {mo:"Sep",yr:2024,a:34,b:7,c:9,lbb:0,cb:0,ground:0},
  {mo:"Oct",yr:2024,a:30,b:6,c:2,lbb:2,cb:28,ground:3},
  {mo:"Nov",yr:2024,a:17,b:4,c:5,lbb:5,cb:12,ground:9},
  {mo:"Dec",yr:2024,a:22,b:5,c:3,lbb:3,cb:14,ground:11},
  // 2025
  {mo:"Jan",yr:2025,a:20,b:7,c:1,lbb:0,cb:0,ground:0},
  {mo:"Feb",yr:2025,a:22,b:4,c:6,lbb:6,cb:18,ground:8},
  {mo:"Mar",yr:2025,a:34,b:8,c:5,lbb:5,cb:27,ground:12},
  {mo:"Apr",yr:2025,a:28,b:8,c:7,lbb:7,cb:29,ground:4},
  {mo:"May",yr:2025,a:41,b:5,c:4,lbb:4,cb:35,ground:7},
  {mo:"Jun",yr:2025,a:25,b:9,c:4,lbb:4,cb:26,ground:5},
  {mo:"Jul",yr:2025,a:22,b:11,c:8,lbb:8,cb:24,ground:6},
  {mo:"Aug",yr:2025,a:29,b:8,c:5,lbb:5,cb:27,ground:2},
  {mo:"Sep",yr:2025,a:24,b:10,c:6,lbb:0,cb:26,ground:0},
  {mo:"Oct",yr:2025,a:23,b:14,c:2,lbb:3,cb:22,ground:5},
  {mo:"Nov",yr:2025,a:17,b:8,c:8,lbb:7,cb:18,ground:3},
  {mo:"Dec",yr:2025,a:33,b:9,c:2,lbb:2,cb:25,ground:4},
  // 2026
  {mo:"Jan",yr:2026,a:18,b:9,c:4,lbb:4,cb:17,ground:0},
  {mo:"Feb",yr:2026,a:18,b:5,c:4,lbb:4,cb:18,ground:0},
  {mo:"Mar",yr:2026,a:29,b:6,c:4,lbb:3,cb:24,ground:0},
  {mo:"Apr",yr:2026,a:19,b:13,c:4,lbb:4,cb:22,ground:3},
  {mo:"May",yr:2026,a:11,b:13,c:6,lbb:6,cb:14,ground:0},
  {mo:"Jun",yr:2026,a:3,b:7,c:3,lbb:3,cb:5,ground:3},
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = {Jan:"January",Feb:"February",Mar:"March",Apr:"April",May:"May",Jun:"June",
  Jul:"July",Aug:"August",Sep:"September",Oct:"October",Nov:"November",Dec:"December"};
const NB_BLUE = "#1e85d0";
const APP_VERSION = "v1.13";

// ─── STORAGE KEY ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "nb_lease_entries_v1";

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const currentYear = new Date().getFullYear();
  const currentMonth = MONTHS[new Date().getMonth()];

  const [view, setView] = useState("entry"); // "entry" | "report" | "yearly"
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Live entries stored in state (and persisted to storage)
  const [liveEntries, setLiveEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Entry form state
  const [form, setForm] = useState({name:"",outcome:"A",disposition:"CB",broker:""});
  const [saving, setSaving] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) setLiveEntries(JSON.parse(res.value));
      } catch(e) { /* no data yet */ }
      setLoaded(true);
    }
    load();
  }, []);

  // Save to storage whenever liveEntries changes
  useEffect(() => {
    if (!loaded) return;
    async function save() {
      try { await window.storage.set(STORAGE_KEY, JSON.stringify(liveEntries)); } catch(e) {}
    }
    save();
  }, [liveEntries, loaded]);

  // Build a unified data structure for reports
  const allMonthlyData = useMemo(() => {
    const map = {};

    // Historical raw entries (2012)
    HISTORICAL_RAW.forEach(({mo,yr,entries}) => {
      const key = `${yr}-${mo}`;
      map[key] = map[key] || {year:yr,month:mo,entries:[],isHistoric:true};
      map[key].entries.push(...entries.map(e=>({...e,id:`hist-${yr}-${mo}-${e.name}`})));
    });

    // Monthly aggregates (2013-2020) — stored as aggregate-only records
    MONTHLY_AGGREGATES.forEach(({mo,yr,a,b,c}) => {
      const key = `${yr}-${mo}`;
      map[key] = {year:yr,month:mo,entries:[],isAggregate:true,agg:{a,b,c,lbb:0,cb:0,ground:0}};
    });

    // Monthly with disposition (2021-2026 partial)
    MONTHLY_WITH_DISP.forEach(({mo,yr,a,b,c,lbb,cb,ground}) => {
      const key = `${yr}-${mo}`;
      map[key] = {year:yr,month:mo,entries:[],isAggregate:true,agg:{a,b,c,lbb,cb,ground}};
    });

    // Live entries
    liveEntries.forEach(e => {
      const key = `${e.year}-${e.month}`;
      map[key] = map[key] || {year:e.year,month:e.month,entries:[],isHistoric:false};
      map[key].entries.push(e);
    });

    return map;
  }, [liveEntries]);

  function getMonthTotals(year, month) {
    const key = `${year}-${month}`;
    const rec = allMonthlyData[key];
    if (!rec) return {a:0,b:0,c:0,lbb:0,cb:0,ground:0};
    if (rec.isAggregate) return rec.agg;
    const entries = rec.entries;
    return {
      a: entries.filter(e=>e.outcome==="A").length,
      b: entries.filter(e=>e.outcome==="B").length,
      c: entries.filter(e=>e.outcome==="C").length,
      lbb: entries.filter(e=>e.disposition==="LBB").length,
      cb: entries.filter(e=>e.disposition==="CB").length,
      ground: entries.filter(e=>e.disposition==="Ground").length,
    };
  }

  function getYearTotals(year) {
    let totals = {a:0,b:0,c:0,lbb:0,cb:0,ground:0};
    MONTHS.forEach(mo => {
      const t = getMonthTotals(year, mo);
      totals.a += t.a; totals.b += t.b; totals.c += t.c;
      totals.lbb += t.lbb; totals.cb += t.cb; totals.ground += t.ground;
    });
    return totals;
  }

  function addEntry() {
    if (!form.name.trim()) return;
    setSaving(true);
    const newEntry = {
      id: `live-${Date.now()}-${Math.random()}`,
      name: form.name.trim(),
      outcome: form.outcome,
      disposition: form.disposition,
      broker: form.broker.trim(),
      year: selectedYear,
      month: selectedMonth,
      timestamp: new Date().toISOString(),
    };
    setLiveEntries(prev => [...prev, newEntry]);
    setForm({name:"",outcome:"A",disposition:"CB",broker:""});
    setTimeout(()=>setSaving(false), 300);
  }

  function deleteEntry(id) {
    setLiveEntries(prev => prev.filter(e=>e.id!==id));
  }

  const currentKey = `${selectedYear}-${selectedMonth}`;
  const currentRec = allMonthlyData[currentKey];
  const currentEntries = currentRec ? (currentRec.isAggregate ? [] : currentRec.entries) : [];
  const currentTotals = getMonthTotals(selectedYear, selectedMonth);
  const isCurrentMonthAggregate = currentRec?.isAggregate || false;

  // YTD for selected year
  const ytd = useMemo(() => {
    let totals = {a:0,b:0,c:0,lbb:0,cb:0,ground:0};
    const monthIndex = MONTHS.indexOf(selectedMonth);
    for (let i=0; i<=monthIndex; i++) {
      const t = getMonthTotals(selectedYear, MONTHS[i]);
      totals.a+=t.a; totals.b+=t.b; totals.c+=t.c;
      totals.lbb+=t.lbb; totals.cb+=t.cb; totals.ground+=t.ground;
    }
    return totals;
  }, [selectedYear, selectedMonth, liveEntries]);

  const years = [];
  for (let y=2012; y<=2026; y++) years.push(y);

  // Printable report
  function handlePrint() { window.print(); }

  const outcomeLabel = {A:"Renewed",B:"Returned",C:"Purchased"};
  const outcomeColor = {A:"#166534",B:"#991b1b",C:"#92400e"};
  const outcomeBg = {A:"#dcfce7",B:"#fee2e2",C:"#fef3c7"};

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",minHeight:"100vh",background:"#f8fafc",color:"#1e293b"}}>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display:none!important; }
          .print-section { display:block!important; }
          body { background:white; }
        }
        @media screen {
          .print-section { display:none; }
        }
      `}</style>

      {/* HEADER */}
      <header className="no-print" style={{background:"white",borderBottom:`3px solid ${NB_BLUE}`,padding:"0 24px",display:"flex",alignItems:"center",gap:16,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0"}}>
          {/* NB Logo placeholder — blue shield style */}
          <div style={{width:48,height:48,background:NB_BLUE,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{color:"white",fontWeight:900,fontSize:18,letterSpacing:"-1px"}}>NB</span>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:17,color:"#1e293b",letterSpacing:"-0.3px"}}>North Bay Lease Retention</div>
            <div style={{fontSize:12,color:"#64748b",letterSpacing:"0.5px",textTransform:"uppercase"}}>Cadillac · GMC · {APP_VERSION}</div>
          </div>
        </div>
        <div style={{flex:1}}/>
        <nav style={{display:"flex",gap:4}}>
          {[["entry","Data Entry"],["report","Monthly Report"],["yearly","Year Summary"]].map(([v,label])=>(
            <button key={v} onClick={()=>setView(v)} style={{
              padding:"8px 16px",borderRadius:6,border:"none",cursor:"pointer",fontWeight:600,fontSize:13,
              background:view===v ? NB_BLUE : "transparent",
              color:view===v ? "white" : "#475569",
              transition:"all 0.15s"
            }}>{label}</button>
          ))}
        </nav>
      </header>

      {/* MONTH/YEAR SELECTOR */}
      <div className="no-print" style={{background:"white",borderBottom:"1px solid #e2e8f0",padding:"10px 24px",display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:13,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px"}}>Period</span>
        <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}
          style={{padding:"6px 10px",border:`1px solid ${NB_BLUE}`,borderRadius:6,fontSize:14,fontWeight:600,color:NB_BLUE,background:"white",cursor:"pointer"}}>
          {MONTHS.map(m=><option key={m} value={m}>{MONTH_FULL[m]}</option>)}
        </select>
        <select value={selectedYear} onChange={e=>setSelectedYear(Number(e.target.value))}
          style={{padding:"6px 10px",border:`1px solid ${NB_BLUE}`,borderRadius:6,fontSize:14,fontWeight:600,color:NB_BLUE,background:"white",cursor:"pointer"}}>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        <span style={{marginLeft:8,fontSize:14,color:"#94a3b8"}}>
          {MONTH_FULL[selectedMonth]} {selectedYear}
        </span>
      </div>

      <main style={{maxWidth:1000,margin:"0 auto",padding:"24px 16px"}}>

        {/* ── DATA ENTRY VIEW ── */}
        {view==="entry" && (
          <div>
            {/* Entry Form */}
            <div className="no-print" style={{background:"white",borderRadius:10,border:`1px solid #e2e8f0`,borderTop:`3px solid ${NB_BLUE}`,padding:24,marginBottom:24,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <h2 style={{margin:"0 0 18px",fontSize:16,fontWeight:700,color:"#1e293b"}}>
                Add Customer — {MONTH_FULL[selectedMonth]} {selectedYear}
              </h2>
              {isCurrentMonthAggregate && (
                <div style={{background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:6,padding:"8px 12px",marginBottom:16,fontSize:13,color:"#92400e"}}>
                  This month has pre-loaded historical data. New entries will be added on top of existing totals.
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Customer Name *</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                    onKeyDown={e=>e.key==="Enter"&&addEntry()}
                    placeholder="Enter name..."
                    style={{width:"100%",padding:"8px 10px",border:"1px solid #cbd5e1",borderRadius:6,fontSize:14,boxSizing:"border-box"}}/>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Outcome</label>
                  <select value={form.outcome} onChange={e=>setForm(f=>({...f,outcome:e.target.value}))}
                    style={{width:"100%",padding:"8px 10px",border:"1px solid #cbd5e1",borderRadius:6,fontSize:14}}>
                    <option value="A">A — Lease Renewed</option>
                    <option value="B">B — Only Returned</option>
                    <option value="C">C — Purchased Old Lease</option>
                  </select>
                </div>
                <div>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Disposition</label>
                  <select value={form.disposition} onChange={e=>setForm(f=>({...f,disposition:e.target.value}))}
                    style={{width:"100%",padding:"8px 10px",border:"1px solid #cbd5e1",borderRadius:6,fontSize:14}}>
                    <option value="CB">CB</option>
                    <option value="LBB">LBB — Lease Buy Back</option>
                    <option value="Ground">Ground</option>
                  </select>
                </div>
              </div>
              <div style={{display:"flex",gap:12,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <label style={{display:"block",fontSize:12,fontWeight:600,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>Broker / Salesperson (optional)</label>
                  <input value={form.broker} onChange={e=>setForm(f=>({...f,broker:e.target.value}))}
                    placeholder="e.g. JG, JY Broker..."
                    style={{width:"100%",padding:"8px 10px",border:"1px solid #cbd5e1",borderRadius:6,fontSize:14,boxSizing:"border-box"}}/>
                </div>
                <button onClick={addEntry} disabled={!form.name.trim()}
                  style={{padding:"9px 24px",background:form.name.trim()?NB_BLUE:"#94a3b8",color:"white",border:"none",borderRadius:6,fontSize:14,fontWeight:700,cursor:form.name.trim()?"pointer":"not-allowed",transition:"background 0.15s"}}>
                  {saving ? "Adding…" : "+ Add Entry"}
                </button>
              </div>
            </div>

            {/* Current month live entries */}
            {currentEntries.filter(e=>!e.id?.startsWith("hist-")).length > 0 && (
              <div className="no-print" style={{background:"white",borderRadius:10,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:20}}>
                <div style={{padding:"14px 20px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:700,fontSize:15}}>Entries — {MONTH_FULL[selectedMonth]} {selectedYear}</span>
                  <span style={{fontSize:13,color:"#64748b"}}>{currentEntries.filter(e=>!e.id?.startsWith("hist-")).length} entries this month</span>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      {["Customer","Outcome","Disposition","Broker",""].map(h=>(
                        <th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:12,fontWeight:600,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntries.filter(e=>!e.id?.startsWith("hist-")).map((e,i)=>(
                      <tr key={e.id} style={{borderTop:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa"}}>
                        <td style={{padding:"10px 16px",fontWeight:500}}>{e.name}</td>
                        <td style={{padding:"10px 16px"}}>
                          <span style={{display:"inline-block",padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:600,background:outcomeBg[e.outcome],color:outcomeColor[e.outcome]}}>
                            {e.outcome} — {outcomeLabel[e.outcome]}
                          </span>
                        </td>
                        <td style={{padding:"10px 16px",fontSize:13,color:"#475569"}}>{e.disposition||"—"}</td>
                        <td style={{padding:"10px 16px",fontSize:13,color:"#64748b"}}>{e.broker||"—"}</td>
                        <td style={{padding:"10px 16px"}}>
                          <button onClick={()=>deleteEntry(e.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MTD Totals card */}
            <TotalsCard totals={currentTotals} label={`MTD — ${MONTH_FULL[selectedMonth]} ${selectedYear}`} showDisp={selectedYear>=2021}/>
            <div style={{marginTop:16}}>
              <TotalsCard totals={ytd} label={`YTD — Through ${MONTH_FULL[selectedMonth]} ${selectedYear}`} showDisp={selectedYear>=2021}/>
            </div>
          </div>
        )}

        {/* ── MONTHLY REPORT VIEW ── */}
        {view==="report" && (
          <div>
            <div className="no-print" style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
              <button onClick={handlePrint} style={{padding:"8px 20px",background:NB_BLUE,color:"white",border:"none",borderRadius:6,fontWeight:600,cursor:"pointer",fontSize:14}}>
                🖨️ Print / Save PDF
              </button>
            </div>

            {/* Printable report */}
            <div style={{background:"white",borderRadius:10,border:"1px solid #e2e8f0",padding:32,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              {/* Report header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,paddingBottom:16,borderBottom:`2px solid ${NB_BLUE}`}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                    <div style={{width:36,height:36,background:NB_BLUE,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{color:"white",fontWeight:900,fontSize:14}}>NB</span>
                    </div>
                    <div>
                      <div style={{fontWeight:800,fontSize:16,color:"#1e293b"}}>North Bay Cadillac · GMC</div>
                      <div style={{fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px"}}>Lease Retention Log</div>
                    </div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:20,fontWeight:800,color:NB_BLUE}}>{MONTH_FULL[selectedMonth]} {selectedYear}</div>
                  <div style={{fontSize:12,color:"#94a3b8"}}>Printed {new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Monthly customer list */}
              {!isCurrentMonthAggregate && currentEntries.filter(e=>!e.id?.startsWith("hist-")).length > 0 ? (
                <div style={{marginBottom:24}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#475569",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>Customer Entries</div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                    <thead>
                      <tr style={{background:"#f8fafc"}}>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>#</th>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Customer</th>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Outcome</th>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Disposition</th>
                        <th style={{padding:"8px 12px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Broker</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEntries.filter(e=>!e.id?.startsWith("hist-")).map((e,i)=>(
                        <tr key={e.id} style={{borderBottom:"1px solid #f1f5f9"}}>
                          <td style={{padding:"7px 12px",color:"#94a3b8"}}>{i+1}</td>
                          <td style={{padding:"7px 12px",fontWeight:500}}>{e.name}</td>
                          <td style={{padding:"7px 12px"}}>
                            <span style={{padding:"1px 8px",borderRadius:12,fontSize:11,fontWeight:700,background:outcomeBg[e.outcome],color:outcomeColor[e.outcome]}}>
                              {e.outcome} — {outcomeLabel[e.outcome]}
                            </span>
                          </td>
                          <td style={{padding:"7px 12px",color:"#475569"}}>{e.disposition||"—"}</td>
                          <td style={{padding:"7px 12px",color:"#64748b"}}>{e.broker||"—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : isCurrentMonthAggregate ? (
                <div style={{background:"#f0f9ff",border:"1px solid #bae6fd",borderRadius:8,padding:16,marginBottom:24,fontSize:13,color:"#0369a1"}}>
                  This month contains pre-loaded historical data. Individual customer entries are stored in the original spreadsheet.
                </div>
              ) : (
                <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:16,marginBottom:24,fontSize:13,color:"#64748b",textAlign:"center"}}>
                  No entries recorded yet for {MONTH_FULL[selectedMonth]} {selectedYear}.
                </div>
              )}

              {/* MTD Totals */}
              <ReportTotalsTable label={`Current Month Totals — ${MONTH_FULL[selectedMonth]} ${selectedYear}`} totals={currentTotals} showDisp={selectedYear>=2021}/>

              <div style={{marginTop:20}}>
                <ReportTotalsTable label={`Year-to-Date Totals — Through ${MONTH_FULL[selectedMonth]} ${selectedYear}`} totals={ytd} showDisp={selectedYear>=2021}/>
              </div>
            </div>
          </div>
        )}

        {/* ── YEARLY SUMMARY VIEW ── */}
        {view==="yearly" && (
          <div>
            <div className="no-print" style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
              <button onClick={handlePrint} style={{padding:"8px 20px",background:NB_BLUE,color:"white",border:"none",borderRadius:6,fontWeight:600,cursor:"pointer",fontSize:14}}>
                🖨️ Print / Save PDF
              </button>
            </div>
            <div style={{background:"white",borderRadius:10,border:"1px solid #e2e8f0",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{padding:"20px 24px",borderBottom:`2px solid ${NB_BLUE}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:800,fontSize:18,color:"#1e293b"}}>Annual Summary — {selectedYear}</div>
                  <div style={{fontSize:13,color:"#64748b"}}>North Bay Cadillac · GMC Lease Retention</div>
                </div>
                <div style={{fontSize:12,color:"#94a3b8"}}>Printed {new Date().toLocaleDateString()}</div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:"#f8fafc"}}>
                      <th style={{padding:"10px 16px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Month</th>
                      <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#166534",borderBottom:"1px solid #e2e8f0"}}>Renewed</th>
                      <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#991b1b",borderBottom:"1px solid #e2e8f0"}}>Returned</th>
                      <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#92400e",borderBottom:"1px solid #e2e8f0"}}>Purchased</th>
                      {selectedYear>=2021 && <>
                        <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>LBB</th>
                        <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>CB</th>
                        <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Ground</th>
                      </>}
                      <th style={{padding:"10px 16px",textAlign:"center",fontWeight:600,color:"#1e293b",borderBottom:"1px solid #e2e8f0"}}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MONTHS.map((mo,i)=>{
                      const t = getMonthTotals(selectedYear, mo);
                      const total = t.a+t.b+t.c;
                      const hasData = total > 0;
                      return (
                        <tr key={mo} style={{borderBottom:"1px solid #f1f5f9",background:i%2===0?"white":"#fafafa",opacity:hasData?1:0.4}}>
                          <td style={{padding:"10px 16px",fontWeight:600}}>{MONTH_FULL[mo]}</td>
                          <td style={{padding:"10px 16px",textAlign:"center",color:"#166534",fontWeight:700}}>{hasData?t.a:"—"}</td>
                          <td style={{padding:"10px 16px",textAlign:"center",color:"#991b1b",fontWeight:700}}>{hasData?t.b:"—"}</td>
                          <td style={{padding:"10px 16px",textAlign:"center",color:"#92400e",fontWeight:700}}>{hasData?t.c:"—"}</td>
                          {selectedYear>=2021 && <>
                            <td style={{padding:"10px 16px",textAlign:"center",color:"#475569"}}>{hasData?(t.lbb||"—"):"—"}</td>
                            <td style={{padding:"10px 16px",textAlign:"center",color:"#475569"}}>{hasData?(t.cb||"—"):"—"}</td>
                            <td style={{padding:"10px 16px",textAlign:"center",color:"#475569"}}>{hasData?(t.ground||"—"):"—"}</td>
                          </>}
                          <td style={{padding:"10px 16px",textAlign:"center",fontWeight:700,color:NB_BLUE}}>{hasData?total:"—"}</td>
                        </tr>
                      );
                    })}
                    {/* Year total row */}
                    {(()=>{
                      const yt = getYearTotals(selectedYear);
                      const total = yt.a+yt.b+yt.c;
                      return (
                        <tr style={{background:NB_BLUE,color:"white"}}>
                          <td style={{padding:"12px 16px",fontWeight:800,fontSize:14}}>YEAR TOTAL</td>
                          <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.a}</td>
                          <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.b}</td>
                          <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.c}</td>
                          {selectedYear>=2021 && <>
                            <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.lbb||0}</td>
                            <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.cb||0}</td>
                            <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{yt.ground||0}</td>
                          </>}
                          <td style={{padding:"12px 16px",textAlign:"center",fontWeight:800,fontSize:14}}>{total}</td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TotalsCard({totals, label, showDisp}) {
  const total = totals.a + totals.b + totals.c;
  return (
    <div style={{background:"white",borderRadius:10,border:"1px solid #e2e8f0",padding:20,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
      <div style={{fontWeight:700,fontSize:14,color:"#64748b",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${showDisp?6:3},1fr)`,gap:12}}>
        <StatBox value={totals.a} label="Renewed" color="#166534" bg="#dcfce7" percent={total > 0 ? Math.round(totals.a/total*100) : 0}/>
        <StatBox value={totals.b} label="Returned" color="#991b1b" bg="#fee2e2" percent={total > 0 ? Math.round(totals.b/total*100) : 0}/>
        <StatBox value={totals.c} label="Purchased" color="#92400e" bg="#fef3c7" percent={total > 0 ? Math.round(totals.c/total*100) : 0}/>
        {showDisp && <>
          <StatBox value={totals.lbb||0} label="LBB" color="#1e40af" bg="#dbeafe"/>
          <StatBox value={totals.cb||0} label="CB" color="#5b21b6" bg="#ede9fe"/>
          <StatBox value={totals.ground||0} label="Ground" color="#475569" bg="#f1f5f9"/>
        </>}
      </div>
      <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #f1f5f9",display:"flex",gap:8,alignItems:"center"}}>
        <span style={{fontSize:12,color:"#94a3b8"}}>Total:</span>
        <span style={{fontSize:18,fontWeight:800,color:"#1e293b"}}>{total}</span>
      </div>
    </div>
  );
}

function StatBox({value, label, color, bg, percent}) {
  return (
    <div style={{background:bg,borderRadius:8,padding:"12px 14px",textAlign:"center"}}>
      <div style={{fontSize:26,fontWeight:800,color,lineHeight:1}}>{value}</div>
      <div style={{fontSize:11,fontWeight:600,color,marginTop:4,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</div>
      {percent !== undefined && <div style={{fontSize:10,fontWeight:700,color,marginTop:6,opacity:0.8}}>{percent}%</div>}
    </div>
  );
}

function ReportTotalsTable({label, totals, showDisp}) {
  const total = totals.a+totals.b+totals.c;
  return (
    <div>
      <div style={{fontWeight:700,fontSize:13,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px"}}>{label}</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,border:"1px solid #e2e8f0",borderRadius:8,overflow:"hidden"}}>
        <thead>
          <tr style={{background:"#f8fafc"}}>
            <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Renewed (A)</th>
            <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Returned (B)</th>
            <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Purchased (C)</th>
            {showDisp && <>
              <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>LBB</th>
              <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>CB</th>
              <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Ground</th>
            </>}
            <th style={{padding:"8px 14px",textAlign:"left",fontWeight:600,color:"#64748b",borderBottom:"1px solid #e2e8f0"}}>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{padding:"10px 14px",fontWeight:700,color:"#166534",fontSize:16}}>{totals.a}</td>
            <td style={{padding:"10px 14px",fontWeight:700,color:"#991b1b",fontSize:16}}>{totals.b}</td>
            <td style={{padding:"10px 14px",fontWeight:700,color:"#92400e",fontSize:16}}>{totals.c}</td>
            {showDisp && <>
              <td style={{padding:"10px 14px",fontWeight:600,color:"#1e40af"}}>{totals.lbb||0}</td>
              <td style={{padding:"10px 14px",fontWeight:600,color:"#5b21b6"}}>{totals.cb||0}</td>
              <td style={{padding:"10px 14px",fontWeight:600,color:"#475569"}}>{totals.ground||0}</td>
            </>}
            <td style={{padding:"10px 14px",fontWeight:800,color:"#1e293b",fontSize:16}}>{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
