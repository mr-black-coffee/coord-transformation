import numeric from 'numeric'

// 计算空间中2点间的距离
export function calcDistance3D(x1, y1, z1, x2, y2, z2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return dist;
}

/**
 * 计算空间中点到线的最短距离
 * @param { Array } point 给定点的坐标 [1, 2, 3]
 * @param { Array } line_start 直线的起点 [0, 0, 0]
 * @param { Array } line_end 终点 [1, 1, 1]
 * @param { Number } decimal 结果的小数位数
 * @return { Number }
 */
export function pointToLineDistance(point, line_start, line_end, decimal = 2) {
    // 将直线表示为向量 v
    const v = line_end.map((coord, i) => coord - line_start[i]);

    // 计算起点到点的向量 w
    const w = point.map((coord, i) => coord - line_start[i]);

    // 计算点到直线的投影向量 p
    const length_v_squared = v.reduce((acc, coord) => acc + coord ** 2, 0);
    const dot_product_wv = w.reduce((acc, coord, i) => acc + coord * v[i], 0);
    const scalar = dot_product_wv / length_v_squared;
    const p = v.map(coord => coord * scalar);

    // 计算投影向量的长度并输出结果
    const distance = Math.sqrt(p.reduce((acc, coord) => acc + coord ** 2, 0));
    
    return distance.toFixed(decimal)
}

/**
 * 通过一组点在2个坐标系中的坐标计算从转换矩阵
 * @param { Array } sourcePoints 源坐标系
 * @param { Array } targetPoints 目标坐标系
 * @returns { Array } 转换矩阵
 */
export function generateTransformationMatrix(sourcePoints, targetPoints) {
    // 建立齐次坐标矩阵
    const homogeneousSourcePoints = sourcePoints.map(pt => [pt[0], pt[1], pt[2], 1]);
    const homogeneousTargetPoints = targetPoints.map(pt => [pt[0], pt[1], pt[2], 1]);
  
    // 解线性方程组，计算两个坐标系之间的变换矩阵
    const transposedHomogeneousSourcePoints = numeric.transpose(homogeneousSourcePoints);
    const A = numeric.dot(transposedHomogeneousSourcePoints, homogeneousSourcePoints);
    const B = numeric.dot(transposedHomogeneousSourcePoints, homogeneousTargetPoints);
    const inverseA = numeric.inv(A);
    const transformationMatrix = numeric.dot(inverseA, B);
    transformationMatrix.push([0, 0, 0, 1]);
    
    return transformationMatrix;
}

/**
 * 获取目标坐标系中的坐标
 * @param { Array } sourcePoint 一个[x, y, z]点坐标,代表源参照系中的点
 * @param { Array } transformationMatrix 转换矩阵
 * @returns { Array } 代表目标参照系中的点的[x, y, z]数组
 */
export function transformPoint(sourcePoint, transformationMatrix) {
    // 将源点[x, y, z]转换成[x, y, z, 1]形式的齐次坐标
    let homogeneousPoint = [sourcePoint[0], sourcePoint[1], sourcePoint[2], 1];
    // 将齐次坐标乘以转换矩阵
    let transformedHomogeneousPoint = numeric.dot(homogeneousPoint, transformationMatrix);
    // 将转换后的齐次坐标转化成[x, y, z]形式的坐标
    let transformedPoint = [
      transformedHomogeneousPoint[0] / transformedHomogeneousPoint[3],
      transformedHomogeneousPoint[1] / transformedHomogeneousPoint[3],
      transformedHomogeneousPoint[2] / transformedHomogeneousPoint[3]
    ];
    return transformedPoint;
  }