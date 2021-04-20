const {GlitchWeb3} = require('@glitchdefi/web3')

const src = `
"use strict";
const {
  msg,
  block,
  balanceOf,
  loadContract,
  loadLibrary,
  isValidAddress,
  deployContract
} = this.runtime;

if (!msg.name) {
  throw new Error("Method name is required.");
}

const __proxyState$Unwrap = value => {
  const real = value && value.__proxyState$RealObj;
  return typeof real !== "function" ? value : real.call(value);
};

const __proxyState$Get = (name, defValue) => {
  // this will throw if msg.callType if 'pure'
  const state = this.getState(name, defValue);

  // no need to check with Object.isFrozen since we can use msg.type
  // note that typeof null is 'object'
  if (state === null || typeof state !== "object" || "view" === msg.callType) {
    return state;
  }

  const saveState = () => this.setState(name, state);

  const makeProxy = realObj => {
    const handler = {
      get(target, property, receiver) {
        if (property === "__proxyState$RealObj") {
          return () => realObj;
        }

        const v = Reflect.get(target, property, receiver);
        if (v === null || typeof v !== "object") {
          return v;
        }
        return makeProxy(v);
      },

      set(target, prop, value, receiver) {
        const r = Reflect.set(
          target,
          prop,
          __proxyState$Unwrap(value),
          receiver
        );
        saveState();
        return r;
      },

      defineProperty(target, property, desc) {
        if (desc.value) {
          desc.value = __proxyState$Unwrap(desc.value);
        }
        const r = Reflect.defineProperty(target, property, desc);
        saveState();
        return r;
      },

      deleteProperty(target, property) {
        const r = Reflect.deleteProperty(target, property);
        saveState();
        return r;
      }
    };

    return new Proxy(realObj, handler);
  };

  return makeProxy(state);
};

class GLC20 {
  get _balances() {
    return __proxyState$Get("_balances", {});
  }

  set _balances(value) {
    this.setState("_balances", __proxyState$Unwrap(value));
  }

  get _allowances() {
    return __proxyState$Get("_allowances", {});
  }

  set _allowances(value) {
    this.setState("_allowances", __proxyState$Unwrap(value));
  }

  get _totalSupply() {
    return __proxyState$Get("_totalSupply");
  }

  set _totalSupply(value) {
    this.setState("_totalSupply", __proxyState$Unwrap(value));
  }

  get _name() {
    return __proxyState$Get("_name");
  }

  set _name(value) {
    this.setState("_name", __proxyState$Unwrap(value));
  }

  get _symbol() {
    return __proxyState$Get("_symbol");
  }

  set _symbol(value) {
    this.setState("_symbol", __proxyState$Unwrap(value));
  }

  get _decimals() {
    return __proxyState$Get("_decimals");
  }

  set _decimals(value) {
    this.setState("_decimals", __proxyState$Unwrap(value));
  }

  __on_deployed(name_, symbol_, totalSupply_, decimals_) {
    this._name = name_;
    this._symbol = symbol_;
    this._totalSupply = totalSupply_;
    this._decimals = decimals_;
    this._balances[
      "tglc1953lj6pmau3fmsdjz0z59r2hp469eudas9x7yl"
    ] = totalSupply_;
  }

  balancesOf(account) {
    let money = this._balances[user];
    if (money === undefined) money = 0;
    return money;
  }

  transfer(recipient, amount) {
    this._transfer(msg.sender, recipient, amount);

    return true;
  }

  allowance(owner, spender) {
    let ret = this._allowances[owner][spender];

    if (ret === undefined) {
      ret = 0;
    }

    return ret;
  }

  approve(spender, amount) {
    this._approve(msg.sender, spender, amount);

    return true;
  }

  transferFrom(sender, recipient, amount) {
    this._transfer(sender, recipient, amount);

    let currentAllowance = this._allowances[sender][recipient];

    if (currentAllowance === undefined) {
      currentAllowance = 0;
    }

    if (currentAllowance < amount) {
      throw new Error("amount greater than currentAllowance");
    }

    this._approve(sender, msg.sender, currentAllowance - amount);

    return true;
  }

  increaseAllowance(spender, addedValue) {
    let currentAllowance = this._allowances[msg.sender][spender];
    if (currentAllowance === undefined) currentAllowance = 0;

    _approve(
      msg.sender,
      spender,
      this._allowances[msg.sender][spender] + addedValue
    );

    return true;
  }

  decreaseAllowance(spender, subtractedValue) {
    let currentAllowance = this._allowances[msg.sender][spender];
    if (currentAllowance === undefined) currentAllowance = 0;

    if (currentAllowance < subtractedValue) {
      throw new Error(
        "subtractedValue greater than currentAllowance of sender"
      );
    }

    _approve(msg.sender, spender, currentAllowance - subtractedValue);

    return true;
  }

  _transfer(sender, recipient, amount) {
    let senderBalance = this._balances[sender];
    if (senderBalance === undefined) senderBalance = 0;

    if (senderBalance < amount) {
      throw new Error("senderBalance smaller than amount");
    }

    this._balances[sender] = senderBalance - amount;

    if (this._balances[recipient] === undefined) {
      this._balances[recipient] = 0;
    }

    this._balances[recipient] += amount;
  }

  _mint(account, amount) {
    _beforeTokenTransfer("", account, amount);

    this._totalSupply += amount;
    this._balances[account] += amount;
  }

  _burn(account, amount) {
    this._beforeTokenTransfer(account, "", amount);

    let accountBalance = this._balances[account];

    if (accountBalance === undefined) {
      accountBalance = 0;
    }

    if (accountBalance < amount) {
      throw new Error("amount to large");
    }

    this._balances[account] = accountBalance - amount;
    this._totalSupply -= amount;
  }

  _approve(owner, spender, amount) {
    this._allowances[owner][spender] = amount;
  }

  _beforeTokenTransfer(from, to, amount) {}
}

const __contract = new GLC20();

const __metadata = {
  _balances: {
    type: "ClassProperty",
    decorators: ["state", "internal"],
    fieldType: "any"
  },
  _allowances: {
    type: "ClassProperty",
    decorators: ["state", "internal"],
    fieldType: "any"
  },
  _totalSupply: {
    type: "ClassProperty",
    decorators: ["view", "state"],
    fieldType: "any"
  },
  _name: {
    type: "ClassProperty",
    decorators: ["view", "state"],
    fieldType: "any"
  },
  _symbol: {
    type: "ClassProperty",
    decorators: ["view", "state"],
    fieldType: "any"
  },
  _decimals: {
    type: "ClassProperty",
    decorators: ["view", "state"],
    fieldType: "any"
  },
  __on_deployed: {
    type: "ClassMethod",
    decorators: ["view"],
    returnType: "any",
    params: [
      {
        name: "name_",
        type: ["string"]
      },
      {
        name: "symbol_",
        type: ["string"]
      },
      {
        name: "totalSupply_",
        type: ["number"]
      },
      {
        name: "decimals_",
        type: ["number"]
      }
    ]
  },
  balancesOf: {
    type: "ClassMethod",
    decorators: ["view"],
    returnType: ["number"],
    params: [
      {
        name: "account",
        type: ["string"]
      }
    ]
  },
  transfer: {
    type: "ClassMethod",
    decorators: ["transaction"],
    returnType: ["boolean"],
    params: [
      {
        name: "recipient",
        type: ["string"]
      },
      {
        name: "amount",
        type: ["number"]
      }
    ]
  },
  allowance: {
    type: "ClassMethod",
    decorators: ["view"],
    returnType: "any",
    params: [
      {
        name: "owner",
        type: ["string"]
      },
      {
        name: "spender",
        type: ["string"]
      }
    ]
  },
  approve: {
    type: "ClassMethod",
    decorators: ["transaction"],
    returnType: ["boolean"],
    params: [
      {
        name: "spender",
        type: ["string"]
      },
      {
        name: "amount",
        type: ["number"]
      }
    ]
  },
  transferFrom: {
    type: "ClassMethod",
    decorators: ["transaction"],
    returnType: ["boolean"],
    params: [
      {
        name: "sender",
        type: ["string"]
      },
      {
        name: "recipient",
        type: ["string"]
      },
      {
        name: "amount",
        type: ["number"]
      }
    ]
  },
  increaseAllowance: {
    type: "ClassMethod",
    decorators: ["transaction"],
    returnType: ["boolean"],
    params: [
      {
        name: "spender",
        type: ["string"]
      },
      {
        name: "addedValue",
        type: ["number"]
      }
    ]
  },
  decreaseAllowance: {
    type: "ClassMethod",
    decorators: ["transaction"],
    returnType: ["boolean"],
    params: [
      {
        name: "spender",
        type: ["string"]
      },
      {
        name: "subtractedValue",
        type: ["number"]
      }
    ]
  },
  _transfer: {
    type: "ClassMethod",
    decorators: ["internal"],
    returnType: "any",
    params: [
      {
        name: "sender",
        type: ["string"]
      },
      {
        name: "recipient",
        type: ["string"]
      },
      {
        name: "amount",
        type: ["number"]
      }
    ]
  },
  _mint: {
    type: "ClassMethod",
    decorators: ["internal"],
    returnType: "any",
    params: [
      {
        name: "account",
        type: ["string"]
      },
      {
        name: "amount",
        type: ["number"]
      }
    ]
  },
  _burn: {
    type: "ClassMethod",
    decorators: ["internal"],
    returnType: "any",
    params: [
      {
        name: "account",
        type: ["string"]
      },
      {
        name: "amount",
        type: ["number"]
      }
    ]
  },
  _approve: {
    type: "ClassMethod",
    decorators: ["internal"],
    returnType: "any",
    params: [
      {
        name: "owner",
        type: ["string"]
      },
      {
        name: "spender",
        type: ["string"]
      },
      {
        name: "amount",
        type: ["number"]
      }
    ]
  },
  _beforeTokenTransfer: {
    type: "ClassMethod",
    decorators: ["internal"],
    returnType: "any",
    params: [
      {
        name: "from",
        type: ["string"]
      },
      {
        name: "to",
        type: ["string"]
      },
      {
        name: "amount",
        type: ["number"]
      }
    ]
  }
};

// block to scope our let/const
{
  const __name =
    typeof __metadata[msg.name] === "string" ? __metadata[msg.name] : msg.name;
  if (
    ["__on_deployed", "__on_received"].includes(msg.name) &&
    !(__name in __contract)
  ) {
    // call event methods but contract does not have one
    return;
  }
  if (
    !["__metadata", "address", "balance", "deployedBy"].includes(__name) &&
    (!(__name in __contract) || __name.startsWith("#"))
  ) {
    throw new Error("Method " + __name + " is private or does not exist.");
  }
  if (
    __metadata[__name] &&
    __metadata[__name].decorators &&
    __metadata[__name].decorators.includes("internal")
  ) {
    throw new Error("Method " + msg.name + " is internal.");
  }
  Object.defineProperties(__contract, Object.getOwnPropertyDescriptors(this));
  const __c = {
    instance: __contract,
    meta: __metadata
  };
  if (__name === "__metadata") {
    return __c;
  }
  const __checkType = (value, typeHolder, typeProp, info) => {
    if (!typeHolder) return value;
    const types = typeHolder[typeProp];
    if (types && Array.isArray(types)) {
      let valueType = value === null ? "null" : typeof value;
      if (!types.includes(valueType)) {
        if (valueType === "object") {
          valueType = Object.prototype.toString
            .call(value)
            .split(" ")[1]
            .slice(0, -1)
            .toLowerCase();
          if (types.includes(valueType)) return value;
        }

        if (valueType === "string" && types.includes("address")) {
          if (isValidAddress(value)) {
            return true;
          }
        }

        throw new Error(
          "Error executing '" +
            __name +
            "': wrong " +
            info +
            " type. Expect: " +
            types.join(" | ") +
            ". Got: " +
            valueType +
            "."
        );
      }
    }
    return value;
  };
  if (typeof __c.instance[__name] === "function") {
    // Check stateMutablitity
    const isValidCallType = d => {
      if (
        ["__on_deployed", "__on_received"].includes(__name) ||
        !__metadata[__name]
      )
        return true; // FIXME
      if (!__metadata[__name].decorators) {
        return false;
      }
      if (
        d === "transaction" &&
        __metadata[__name].decorators.includes("payable")
      ) {
        return true;
      }
      return __metadata[__name].decorators.includes(d);
    };
    if (!isValidCallType(msg.callType)) {
      throw new Error(
        "Method " +
          __name +
          " is not decorated as @" +
          msg.callType +
          " and cannot be invoked in such mode"
      );
    }
    // Check input param type
    const params = msg.params;
    if (
      __metadata[__name] &&
      __metadata[__name].params &&
      __metadata[__name].params.length
    ) {
      __metadata[__name].params.forEach((p, index) => {
        const pv = params.length > index ? params[index] : undefined;
        __checkType(pv, p, "type", "param '" + p.name + "'");
      });
    }
    // Call the function, finally
    if (typeof __c.instance.onready === "function") __c.instance.onready();
    const result = __c.instance[__name].apply(__c.instance, params);
    return __checkType(result, __metadata[__name], "returnType", "return");
  }

  if (typeof __c.instance.onready === "function") __c.instance.onready();
  return __checkType(
    __c.instance[__name],
    __metadata[__name],
    "fieldType",
    "field"
  );
}
`

const newAccounWithBalance = async (tweb3, intialBalance = 100) => {
    const account = tweb3.wallet.createBankAccount()
    await tweb3.contract('system.faucet').prepareMethod('request').send()
    return account
}

let tweb3 = new GlitchWeb3('http://172.16.1.209:26657/')
// let tweb3 = new GlitchWeb3('ws://172.16.1.209:26657/websocket')

async function func() {
    let account100 = await newAccounWithBalance(tweb3)
    console.log(account100)

    const {address : from} = account100
    const contract = await tweb3.deploy({
        data: src,
        arguments: ["Glitch", "GLC", 999999999999, 18]
    })
    console.log(contract)
}

func()




// moon walnut lawsuit bachelor juice dust dust win labor can bar pave
