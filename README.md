# Toqen Components

### Create Token Component

```jsx
<Create
  standart={`ERC20|ERC721`}
  toqen={`Address`}
  handle={({ data, status }) => {}}
/>
```

### Mint Token Component

```jsx
<Mint 
    address={`Address ERC20|ERC721`} 
    handle={({ data, status }) => {}} />
```

### Approve Token Component

```jsx
<Approve
    address={`Address ERC20|ERC721`}
    {/* Approve One ERC721 */}
    to={`Address`}
    tokenId={`ID ERC721`}
    {/* Approve All ERC721 */}
    operator={`Address`}
    approved={`true|false`}
    {/* Approve ERC20 */}
    spender={`Address`}
    value={`Amount ERC20`}
    handle={({data,status})=>{}} />
```

### Contract Toqen

- https://github.com/toqenfactory/contracts
