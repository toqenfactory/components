# Toqen Components

<img src="https://raw.githubusercontent.com/toqenfactory/components/main/src/image.png" />

### Create ERC20 Token

```jsx
<Create standart="ERC20" toqen="TOQEN Contract Address" dark />
```

### Create ERC721 Token

```jsx
<Create standart="ERC721" toqen="TOQEN Contract Address" dark />
```

### Mint ERC20 Token

```jsx
<Mint standart="ERC20" address="ERC20 Address" dark={false} />
```

### Mint ERC721 Token

```jsx
<Mint standart="ERC721" address="ERC721 Address" steps={false} dark />
```

### Approve ERC20 Token

```jsx
<Approve address="ERC20 Address" spender="Address" value="10" steps dark />
```

### Approve ERC721 Token

```jsx
<Approve address="ERC721 Address" to="Address" tokenId="3" steps dark />
```

### Approve ALL ERC721 Token

```jsx
<Approve address="ERC721 Address" operator="Address" approved={true} dark />
```

### Disapprove ALL ERC721 Token

```jsx
<Approve address="ERC721 Address" operator="Address" approved={false} dark />
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
