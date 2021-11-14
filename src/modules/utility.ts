
export const sortFn = (name)=> (item1, item2)=>{
  // tslint:disable-next-line:no-unused-expression
  if(item1[name]<item2[name]){
    return -1;
  } else if(item1[name]>item2[name]){
    return 1;
  }
  return 0
}
export const reduceFn = (arr)=>arr.reduce((totalHeight,height)=>totalHeight + Math.round(height),0)
