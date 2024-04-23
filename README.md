# Toqen Components

<img src="https://raw.githubusercontent.com/toqenfactory/components/main/src/image.png"

### Create ERC20 Token

```jsx
<Create standart="ERC20" toqen="TOQEN Contract Address" />
```

### Create ERC721 Token

```jsx
<Create standart="ERC721" toqen="TOQEN Contract Address" />
```

### Mint ERC20 Token

```jsx
<Mint standart="ERC20" address="ERC20 Address" />
```

### Mint ERC721 Token

```jsx
<Mint standart="ERC721" address="ERC721 Address" steps={true} />
```

### Approve ERC20 Token

```jsx
<Approve address="undefined" spender="Address" value="10" steps={true} />
```

### Approve ERC721 Token

```jsx
<Approve address="undefined" to="Address" tokenId="3" steps={true} />
```

### Approve ALL ERC721 Token

```jsx
<Approve address="undefined" operator="Address" approved={true} steps={true} />
```

### Disapprove ALL ERC721 Token

```jsx
<Approve address="undefined" operator="Address" approved={false} steps={true} />
```

## Param `handle`

```
handle={({ data, status }) => {
  console.log("data", data);
  console.log("status", status);
}}
```

### Contract Toqen

- https://github.com/toqenfactory/contracts
